var https = require('https');
var util = require('util');
var readline = require('readline');
var fs = require('fs');
var mkdirp = require('mkdirp');
var EventEmitter = require("events").EventEmitter;
var emitter = new EventEmitter();

// Process:
//
// 1. Read Logstash sources from repos.txt file
// 2. Parse configuration values
// 3. Generate specs
//

var specFile = "./logstash_configs.json";
var reposFile = "./repos.txt";
var templatesDir = "./resources/templates/";
var generatedDir = "./nodes";
var packJsonFile = "./package.json";
var supported = "input,output,filter";
var counts = {supported: 0, ignored: 0, input: 0, output: 0, filter: 0};

var paramsToFetch = [
    {
        types: ["input", "filter", "output"],
        prefix: "",
        url: "https://raw.githubusercontent.com/elastic/logstash/master/logstash-core/lib/logstash/%ss/base.rb"
    },
    {
        types: ["output-elasticsearch"],
        prefix: "mod.",
        url: "https://raw.githubusercontent.com/logstash-plugins/logstash-%s/master/lib/logstash/outputs/elasticsearch/common_configs.rb"
    }
];
var baseParams = {};
var prefetchCount = paramsToFetch.map(function(spec) {return spec.types.length}).reduce(function(a,b){return a+b;});

// parse base parameters first
paramsToFetch.forEach(function(paramSpec) {
    paramSpec.types.forEach(function(type) {
        var fileUrl = util.format(paramSpec.url, type);
        https.get(fileUrl, function(response) {
            var data = [];
            response.on('data', function (chunk) { data.push(chunk); });
            response.on('close', function (error) {});
            response.on('end', function() {
                baseParams[type] = parseRubySource(data.join(""), paramSpec.prefix, true);

                if (Object.keys(baseParams).length === prefetchCount) {
                    emitter.emit("base-params-fetched");
                }
            });
        });
    });
});

function parseRubySource(content, prefix, isBase) {
    var params = [];
    var lines = content.split("\n");
    var comments = [];
    for (var i = 0; i < lines.length; i++) {
        var trimmed = lines[i].trim();
        if (trimmed.indexOf("#") === 0) {
            comments.push(trimmed.substring(2));
        }
        if (trimmed.length === 0) comments = [];
        if (trimmed.indexOf(prefix + "config ") === 0) {
            var param = {
                comments: comments.join("\n"),
                base: isBase
            };
            var isObsolete = false;
            trimmed.replace(/,\s+:/g, ";").split(";").forEach(function(cell, i){
                if (i === 0) {
                    param.name = cell.replace(prefix + "config :", "").trim();
                } else {
                    cell = cell.trim().replace(/:/g, "").replace(/\s+=>\s+/, ":").split(":");
                    isObsolete = isObsolete || (cell[0] === "obsolete");
                    try {
                        param[cell[0]] = JSON.parse(cell[1].replace(/'/g, '"'));
                    } catch (e) {
                        param[cell[0]] = cell[1] ? cell[1].replace(/'/g, '"') : null;
                    }
                }
            });
            if (!isObsolete) params.push(param);
            comments = [];
        }
    }
    return params;
}

// then parse each repo name
emitter.on("base-params-fetched", function() {
    var lineReader = readline.createInterface({
        input: fs.createReadStream(reposFile),
        terminal: false
    });

    lineReader.on('line', function (line) {
        var comp = line.split("-");
        var componentType = comp[1];
        var componentName = comp[2];
        if (supported.indexOf(componentType) >= 0) {
            counts.supported++;
            var fileUrl = util.format("https://raw.githubusercontent.com/logstash-plugins/%s/master/lib/logstash/%ss/%s.rb", line, componentType, componentName);
            var component = {
                url: fileUrl,
                name: componentName,
                type: componentType,
                params: baseParams[componentType].concat(baseParams[componentType+"-"+componentName] || [])
            };
            emitter.emit("new-component", component);
        }
    });
});

// fetch the content of the Logstash component source file
emitter.on("new-component", function(component) {
    https.get(component.url, function(response) {
        var data = [];
        response.on('data', function (chunk) { data.push(chunk); });
        response.on('close', function (error) {});
        response.on('end', function() {
            var resp = data.join("");
            if (resp === "Not Found") {
                counts.ignored++;
                return;
            }
            emitter.emit("content-fetched", component, data.join(""));
        });
    });
});

// Parse the raw source to extract config values
emitter.on("content-fetched", function(component, content) {
    component.params = component.params.concat(parseRubySource(content, "", false));
    emitter.emit("component-parsed", component);
});

// Write the component specs to the specs.json
var components = [];
var shortTypes = {"input": "in", "output": "out", "filter": "flt"};
emitter.on("component-parsed", function(component) {
    components.push(component);
    counts[component.type]++;
    emitter.emit("generate-component", component);

    // are we through?
    if (counts.supported - counts.ignored === components.length) {
        // write spec file
        if (fs.existsSync(specFile)) {
            fs.unlinkSync(specFile);
        }
        fs.appendFileSync(specFile, JSON.stringify(components, null, 2));

        components.sort(function(c1, c2) {
            var typeCompare = c1.type.localeCompare(c2.type);
            if (typeCompare === 0) return c1.name.localeCompare(c2.name);
            return typeCompare;
        });

        // update package.json
        var nodes = {};
        components.forEach(function(component) {
            var nodeId = ["ls", shortTypes[component.type], component.name].join("-");
            var folder = ["nodes", component.type, component.name].join("/");
            nodes[nodeId] = util.format("%s/%s.js", folder, component.name);
        });
        var packJson = JSON.parse(fs.readFileSync(packJsonFile).toString("utf8"));
        packJson['node-red'].nodes = nodes;
        fs.writeFileSync(packJsonFile, JSON.stringify(packJson, null, 4));

        console.log("Done generating components: %j", counts);
    }
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// generate component files
emitter.on("generate-component", function(component) {
    var componentFolder = [generatedDir, component.type, component.name].join("/");
    mkdirp.sync(componentFolder);

    // move required first, then sort alpha and finally base params at the end
    component.params.sort(function(p1, p2) {
        if (p1.required && !p2.required) return -1;
        if (!p1.required && p2.required) return 1;
        return p1.name.localeCompare(p2.name);
    });

    var variables = {
        name: component.name,
        Name: capitalizeFirstLetter(component.name),
        type: component.type,
        Type: capitalizeFirstLetter(component.type),
        shorttype: shortTypes[component.type],
        jsFields: "",
        htmlFields: ""
    };

    function generate(vars, templateName, fileName) {
        var template = fs.readFileSync(templatesDir + templateName).toString("utf8");
        for (var v in vars) {
            template = template.replace(new RegExp("{{"+v+"}}", "g"), vars[v]);
        }
        if (fileName) {
            fs.writeFileSync([componentFolder, fileName].join("/"), template);
        } else {
            return template;
        }
    }

    variables.htmlFields = component.params.map(function(param) {
        if (param.deprecated) return "";
        if (typeof param['default'] !== "string") param['default'] = JSON.stringify(param['default']);
        else if (typeof param['default'] !== "undefined") param['default'] = param['default'].replace(/\n/, "\\n");
        var vars = {
            field: param.name,
            label: capitalizeFirstLetter(param.name.replace(/_/g, " ")),
            placeholder: param['default'] || ""
        };
        if (param.validate instanceof Array) {
            vars.options = param.validate.map(function(option, index, array) {
                var selected = (param['default'] === option) ? ' selected="selected"' : '';
                return util.format('<option value="%s"%s>%s</option>', option, selected, option);
            }).join("");
            return generate(vars, "form-row-select.htmlt", null);
        } else if (param.validate === "boolean") {
            vars.selectTrue = (param['default'] === true) ? ' selected="selected"' : '';
            vars.selectFalse = (param['default'] === false) ? ' selected="selected"' : '';
            return generate(vars, "form-row-boolean.htmlt", null);
        } else if (param.validate === "codec") {
            return generate(vars, "form-row-codec.htmlt", null);
        } else {
            vars.inputType = (param.validate === "number") ? "number" : "text";
            return generate(vars, "form-row-text.htmlt", null);
        }
    }).join("");

    variables.jsFields = component.params.map(function(param, index, array) {
        if (param.deprecated) return "";
        var comma = (index === array.length - 1) ? "" : ",";
        var validateIsArray = (param.validate instanceof Array);
        var deflt = (validateIsArray || param.validate === "boolean" || param.validate === "codec") ? param['default'] : "";
        if (validateIsArray && typeof deflt === "string" && deflt !== "[]") {
            deflt = deflt.replace(/\[\"/,"").replace(/\"\]/,"");
        }
        return util.format('ls_%s: {value:"%s", required: %s}%s', param.name, deflt, (param.required === true), comma);
    }).join("");

    // write HTML
    generate(variables, component.type + ".htmlt", component.name + ".html");

    // write JS
    generate(variables, component.type + ".jst", component.name + ".js");

});
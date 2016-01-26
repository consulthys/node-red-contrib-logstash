var util = require("util");
var http = require('http');

//var flowId = "508f8fd4.af707";

var flowId = null;
var confName = null;
if (process.argv.length > 2) {
    if (process.argv[2] === "-h") {
        console.log("USAGE: node flow2logstash <flowId> <outFile>");
        console.log("  <flowId> the id of the flow to generate the Logstash config for");
        console.log("  <outFile> the name of the Logstash config file (defaults to flow name)");
        process.exit();
    }
    flowId = process.argv[2];
    confName = (process.argv.length > 3) ? process.argv[3] : null;
}

if (!flowId) {
    console.log("No flow ID. Use the -h switch to get help on how to use this script.");
    process.exit();
}

getFlow(flowId, generate);

var ops = {
    eq: "=="
};

function getFlow(flowId, callback) {
    // Issue ES query
    var reqOptions = {
        host: "localhost",
        port: 1880,
        path: "/flow/" + flowId,
        method: 'GET'
    };
    var flowReq = http.request(reqOptions, function(flowRes) {
        var data = [];
        flowRes.on('data', function (chunk) {
            data.push(chunk);
        });
        flowRes.on('close', function (error) {
        });
        flowRes.on('end', function() {
            var results = data.length > 0 ? JSON.parse(data.join("")) : {};
            callback(null, results);
        });

    });
    flowReq.on('error', function(e) {
        callback(new Error('Problem with flow request: ' + e.message), {});
    });
    flowReq.end();
}

function generate(err, flow) {
    var file_name = confName || (flow.label.toLowerCase() + ".conf");

    // parse flow
    var components = {
        "in": {name: "input", elements:{}},
        "flt": {name: "filter", elements:{}},
        "out": {name: "output", elements:{}}
    };
    var otherNodes = [];

    flow.nodes.forEach(function(node) {
        var type = node.type.split("-");

        // handle logstash nodes
        if (type.length === 3 && type[0] === "ls") {
            var component = {"_name": type[2]};
            for (var prop in node) {
                if (/^ls_/.test(prop) && node[prop]) {
                    component[prop.substring(3)] = node[prop];
                }
            }
            components[type[1]].elements[node.id] = component;
        }
        // keep for the second pass
        else {
            otherNodes.push(node);
        }
    });

    // Second pass to handle core nodes
    otherNodes.forEach(function(node) {
        if (node.type === "switch") {
            var rules = node.rules;

            rules.forEach(function(rule, index) {
                var wire = node.wires[index][0];
                if (wire && components.flt.elements[wire]) {
                    components.flt.elements[wire]._rule = util.format("[%s] %s \"%s\"", node.property, ops[rule.t], rule.v);
                }
            });
        }
    });

    ["in", "flt", "out"].forEach(function(sectionId) {
        var section = components[sectionId];
        console.log("%s {", section.name);
        for (var elemId in section.elements) {
            var element = section.elements[elemId];
            if (element._rule) {
                console.log("  if %s {", element._rule);
            }
            console.log("    %s {", element._name);
            for (var prop in element) {
                if (!/^_/.test(prop) && element[prop]) {
                    console.log("      %s => \"%s\"", prop, element[prop]);
                }
            }
            if (element._rule) {
                console.log("    }");
            }
            console.log("  }");
        }
        console.log("}");
    });
}
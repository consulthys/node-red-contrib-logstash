var https = require('https');
var fs = require('fs');

// Process:
//
// 1. Read Logstash source
// https://github.com/logstash-plugins/logstash-input-file/blob/master/lib/logstash/inputs/file.rb
//
// 2. Parse configuration values
//
// 3. Generate corresponding node module
//

var reposFile = "./repos.txt";
if (fs.existsSync(reposFile)) {
    fs.unlinkSync(reposFile);
}

function getPlugins(callback) {
    var reqOptions = {
        host: "api.github.com",
        path: "/orgs/logstash-plugins/repos?page=1&per_page=100&sort=full_name", // page=2+3
        method: 'GET',
        headers: {
            'User-Agent': 'consulthys'
        }
    };
    var repoReq = https.request(reqOptions, function(repoRes) {
        var data = [];
        repoRes.on('data', function (chunk) {
            data.push(chunk);
        });
        repoRes.on('close', function (error) {
        });
        repoRes.on('end', function() {
            var results = data.length > 0 ? JSON.parse(data.join("")) : {};
            callback(null, results);
        });

    });
    repoReq.on('error', function(e) {
        callback(new Error('Problem with repo request: ' + e.message), {});
    });
    repoReq.end();
}

function registerRepos(err, repos) {
    repos.forEach(function(repo) {
        fs.appendFileSync(reposFile, repo.name + "\n");
    });
}

getPlugins(registerRepos);

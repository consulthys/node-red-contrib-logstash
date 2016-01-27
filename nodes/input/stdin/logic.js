module.exports = function(RED) {

    var readline = require('readline');

    this.tags = config.ls_tags;
    this.type = config.ls_type;

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', function(line){
        node.send({
            type: node.type,
            tags: node.tags,
            payload: line
        });
    });

    this.on("close", function() {
        if (rl) { rl.close(); }
    });
};

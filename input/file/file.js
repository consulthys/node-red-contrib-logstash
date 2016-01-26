module.exports = function(RED) {

    var Tail = require('tail').Tail;

    function LogstashInputFileNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.path = config.ls_path;
        this.ls_type = config.ls_type;
        this.codec = config.ls_codec;
        this.delimiter = config.ls_delimiter;
        this.start_position = config.ls_start_position;
        this.fromBeginning = (this.start_position === "beginning");

        var tail = new Tail(this.path, this.delimiter, {}, this.fromBeginning);

        tail.on("line", function(data) {
            // parse to JSON?
            if (node.codec === "json") {
                try {
                    data = JSON.parse(data);
                } catch (parseError) {
                    node.error("Error while parsing: " + data, parseError);
                }
            }
            node.send({
                topic: node.path,
                type: node.ls_type,
                payload: data
            });
        });

        tail.on("error", function(error) {
            node.error("Error when tailing " + this.path, error);
        });

        this.on("close", function() {
            if (tail) { tail.unwatch(); }
        });
    }
    RED.nodes.registerType("ls-in-file", LogstashInputFileNode);
};

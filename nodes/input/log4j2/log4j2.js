module.exports = function(RED) {

    function LogstashInputLog4j2Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-log4j2", LogstashInputLog4j2Node);
};

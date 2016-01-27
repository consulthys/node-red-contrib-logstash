module.exports = function(RED) {

    function LogstashInputLog4jNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-log4j", LogstashInputLog4jNode);
};

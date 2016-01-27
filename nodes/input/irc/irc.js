module.exports = function(RED) {

    function LogstashInputIrcNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-irc", LogstashInputIrcNode);
};

module.exports = function(RED) {

    function LogstashInputUnixNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-unix", LogstashInputUnixNode);
};

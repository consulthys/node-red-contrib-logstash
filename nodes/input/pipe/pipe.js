module.exports = function(RED) {

    function LogstashInputPipeNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-pipe", LogstashInputPipeNode);
};

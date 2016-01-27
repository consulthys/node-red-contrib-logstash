module.exports = function(RED) {

    function LogstashInputPuppet_facterNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-puppet_facter", LogstashInputPuppet_facterNode);
};

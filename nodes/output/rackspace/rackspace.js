module.exports = function(RED) {

    function LogstashOutputRackspaceNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function(msg) {
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-out-rackspace", LogstashOutputRackspaceNode);
};

module.exports = function(RED) {

    function LogstashFilterCloudfoundryNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("input", function(msg) {
            node.send(msg);
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-flt-cloudfoundry", LogstashFilterCloudfoundryNode);
};

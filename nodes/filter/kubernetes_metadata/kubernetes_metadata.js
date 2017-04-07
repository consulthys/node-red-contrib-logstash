module.exports = function(RED) {

    function LogstashFilterKubernetes_metadataNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("input", function(msg) {
            node.send(msg);
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-flt-kubernetes_metadata", LogstashFilterKubernetes_metadataNode);
};

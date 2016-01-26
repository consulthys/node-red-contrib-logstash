module.exports = function(RED) {

    function LogstashFilterMutateNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.lowercase = config.ls_lowercase;

        this.on("input", function(msg) {
            if (node.lowercase && msg.payload[node.lowercase]) {
                msg.payload[node.lowercase] = msg.payload[node.lowercase].toLowerCase();
            }
            node.send(msg);
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-flt-mutate", LogstashFilterMutateNode);
};

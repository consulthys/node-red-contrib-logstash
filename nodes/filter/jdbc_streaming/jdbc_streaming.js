module.exports = function(RED) {

    function LogstashFilterJdbc_streamingNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("input", function(msg) {
            node.send(msg);
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-flt-jdbc_streaming", LogstashFilterJdbc_streamingNode);
};

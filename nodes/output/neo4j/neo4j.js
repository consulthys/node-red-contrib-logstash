module.exports = function(RED) {

    function LogstashOutputNeo4jNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function(msg) {
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-out-neo4j", LogstashOutputNeo4jNode);
};

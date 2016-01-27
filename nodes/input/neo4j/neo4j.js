module.exports = function(RED) {

    function LogstashInputNeo4jNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-neo4j", LogstashInputNeo4jNode);
};

module.exports = function(RED) {

    function LogstashOutputElasticsearch_javaNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function(msg) {
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-out-elasticsearch_java", LogstashOutputElasticsearch_javaNode);
};

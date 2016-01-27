module.exports = function(RED) {

    function LogstashOutputSolr_httpNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function(msg) {
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-out-solr_http", LogstashOutputSolr_httpNode);
};

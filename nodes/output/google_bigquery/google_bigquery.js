module.exports = function(RED) {

    function LogstashOutputGoogle_bigqueryNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function(msg) {
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-out-google_bigquery", LogstashOutputGoogle_bigqueryNode);
};

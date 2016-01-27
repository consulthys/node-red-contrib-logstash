module.exports = function(RED) {

    function LogstashOutputDatadog_metricsNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function(msg) {
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-out-datadog_metrics", LogstashOutputDatadog_metricsNode);
};

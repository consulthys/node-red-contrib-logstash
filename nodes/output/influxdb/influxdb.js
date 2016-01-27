module.exports = function(RED) {

    function LogstashOutputInfluxdbNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function(msg) {
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-out-influxdb", LogstashOutputInfluxdbNode);
};

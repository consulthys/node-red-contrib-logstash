module.exports = function(RED) {

    function LogstashOutputMonasca_log_apiNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function(msg) {
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-out-monasca_log_api", LogstashOutputMonasca_log_apiNode);
};

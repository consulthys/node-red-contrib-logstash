module.exports = function(RED) {

    function LogstashInputHttp_pollerNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-http_poller", LogstashInputHttp_pollerNode);
};

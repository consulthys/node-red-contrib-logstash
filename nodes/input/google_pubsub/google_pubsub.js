module.exports = function(RED) {

    function LogstashInputGoogle_pubsubNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-google_pubsub", LogstashInputGoogle_pubsubNode);
};

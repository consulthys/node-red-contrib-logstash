module.exports = function(RED) {

    function LogstashInputGoogleanalyticsNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-googleanalytics", LogstashInputGoogleanalyticsNode);
};

module.exports = function(RED) {

    function LogstashInputSalesforceNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-salesforce", LogstashInputSalesforceNode);
};

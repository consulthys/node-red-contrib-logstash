module.exports = function(RED) {

    function LogstashOutputNullNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function(msg) {
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-out-null", LogstashOutputNullNode);
};

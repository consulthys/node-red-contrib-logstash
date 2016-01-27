module.exports = function(RED) {

    function LogstashOutputNagios_nscaNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function(msg) {
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-out-nagios_nsca", LogstashOutputNagios_nscaNode);
};

module.exports = function(RED) {

    function LogstashInputJdbcNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-jdbc", LogstashInputJdbcNode);
};

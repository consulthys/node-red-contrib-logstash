module.exports = function(RED) {

    function LogstashFilterI18nNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("input", function(msg) {
            node.send(msg);
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-flt-i18n", LogstashFilterI18nNode);
};

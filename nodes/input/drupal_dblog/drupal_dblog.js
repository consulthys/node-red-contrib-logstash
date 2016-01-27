module.exports = function(RED) {

    function LogstashInputDrupal_dblogNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-drupal_dblog", LogstashInputDrupal_dblogNode);
};

module.exports = function(RED) {

    function LogstashInputCouchdb_changesNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-couchdb_changes", LogstashInputCouchdb_changesNode);
};

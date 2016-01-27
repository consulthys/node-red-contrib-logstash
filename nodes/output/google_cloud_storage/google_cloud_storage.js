module.exports = function(RED) {

    function LogstashOutputGoogle_cloud_storageNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on('input', function(msg) {
        });

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-out-google_cloud_storage", LogstashOutputGoogle_cloud_storageNode);
};

module.exports = function(RED) {

    function LogstashInputS3Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-s3", LogstashInputS3Node);
};

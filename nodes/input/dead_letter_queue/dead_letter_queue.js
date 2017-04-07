module.exports = function(RED) {

    function LogstashInputDead_letter_queueNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-dead_letter_queue", LogstashInputDead_letter_queueNode);
};

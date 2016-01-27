module.exports = function(RED) {

    function LogstashInputMeetupNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.on("close", function() {
        });
    }
    RED.nodes.registerType("ls-in-meetup", LogstashInputMeetupNode);
};

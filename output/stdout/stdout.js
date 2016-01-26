module.exports = function(RED) {

    function LogstashOutputStdoutNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.codec = config.ls_codec;
        this.workers = config.ls_workers;

        this.on('input', function(msg) {
            console.log(JSON.stringify(msg));
            node.log(JSON.stringify(msg));
        });
    }
    RED.nodes.registerType("ls-out-stdout", LogstashOutputStdoutNode);
};

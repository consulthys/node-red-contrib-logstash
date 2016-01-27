module.exports = function(RED) {

    this.lowercase = config.ls_lowercase;

    this.on("input", function(msg) {
        if (node.lowercase && msg.payload[node.lowercase]) {
            msg.payload[node.lowercase] = msg.payload[node.lowercase].toLowerCase();
        }
        node.send(msg);
    });

    this.on("close", function() {
    });
};

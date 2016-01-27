module.exports = function(RED) {

    this.codec = config.ls_codec;
    this.workers = config.ls_workers;

    this.on('input', function(msg) {
        console.log(JSON.stringify(msg));
        node.log(JSON.stringify(msg));
    });
};

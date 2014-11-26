var dnode = require('dnode'),
    logger = require('common/core/logs')(module);

function Server(port, api){
    if( !port || !api ) throw new Error("Doesn't have port or api");

    this.port = port;
    this.api = api;

    /*instanse dnode service*/
    this.server = null;
    this.init();
}

Server.prototype = {
    init: function () {
        this.server = dnode(this.api);
        this.server.listen(this.port);
        logger.info("Service listen " + this.port + " port");
    }
};

function getServer(port, api){
    return new Server(port, api);
}

module.exports = getServer;
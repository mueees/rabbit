var dnode = require('dnode'),
    logger = require('common/core/logs')(module);

function Service(port){
    if(!port) throw new Error("Cannot find port");

    /*remote service port*/
    this.port = port;

    /* remote service */
    this.remote = null;
    /* remote connection */
    this.connection = null;

    this._connect();
}
Service.prototype = {
    _connect: function () {
        var _this = this;
        this.connection = dnode.connect(_this.port);

        this.connection.on('remote', function (remote) {
            logger.info("Connection with remote service was established. Port: " + _this.port);
            _this.remote = remote;
        });

        this.connection.on('fail', function () {
            logger.error("Remote service protocol error.");
            _this.remote = null;
            _this._reconnect();
        });

        this.connection.on('end', function (remote) {
            logger.error("Remote service disconect.");
            _this.remote = null;
            _this._reconnect();
        });

        this.connection.on('error', function (remote) {
            logger.error("Remote service get error on callback.");
            _this.remote = null;
            _this._reconnect();
        });
    },
    _reconnect: function () {
        var _this = this;
        setTimeout(function () {
            _this._connect();
        }, 1000);
    },

    execute: function (methodName, options) {
        var args = [].splice.call(arguments,0);
        args.splice(0, 1);

        if(!this.remote){
            var cb = args.pop();
            logger.error("Doesn't have access to remote service");
            return cb({
                status: 500,
                message: "Doesn't have access to remote service"
            });
        }else{
            this.remote[methodName].apply(this, args);
        }
    }
};

function getService(port){
    return new Service(port);
}
module.exports = getService;
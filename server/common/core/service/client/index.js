var dnode = require('dnode'),
    ServiceError = require('common/core/errors/service.error').ServiceError;
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
        var args = [].splice.call(arguments,0),
            cb;
        args.splice(0, 1);

        if(!this.remote){
            cb = args.pop();
            logger.error("Doesn't have connection to remote service");
            return cb(new ServiceError(500, "Doesn't have connection to remote service"));
        }else{
            if( !this.remote[methodName] ){
                cb = args.pop();
                return cb(new ServiceError(500, "Doesn't have "+ methodName + " method"));
            }else{
                this.remote[methodName].apply(this, args);
            }
        }
    }
};

function getService(port){
    return new Service(port);
}
module.exports = getService;
var winston = require('winston');
var path = require('path');
var ENV = process.env.NODE_ENV;
var raven = require('raven');
var config = require('config');
var sentry = new raven.Client(config.get("raven:key"));

/*
 * We doesn't need write logs in file
 * Just to sentry and to Console
 * */

function Logger(module) {
    var pathModule = module.filename.split("/").slice(-2).join('/');
    var win = new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true
            })
        ]
    });

    function extendOptions(options) {
        var result = {};
        options = options || {};

        if(options.extra) {
            result.extra = options.extra;
        }else{
            result.extra = options;
        }

        result.extra.pathModule = pathModule;
        return result;
    }

    function canSentrySend(){
        return (ENV == 'live');
    }

    this.debug = function (message, options) {
        send('info', message, options);
    };

    this.info = function (message, options) {
        send('info', message, options);
    };

    this.warning = function (message, options) {
        send('warning', message, options);
    };

    this.error = function (message, options) {
        send('error', message, options);
    };

    function send(type, message, options) {
        var isErrorType = false;
        var mess = message;

        if( message instanceof Error){
            isErrorType = true;
            mess = message.message;
        }

        options = extendOptions(options);
        options.level = type;

        if(type == 'warning'){
            win.warn(mess, options);
        }else {
            win[type](mess, options);
        }

        if(canSentrySend) {
            if( type == "error" || type == "warning" ){
                if(isErrorType){
                    sentry.captureError(message, options);
                }else{
                    sentry.captureMessage(message, options);
                }
            }
        }
    }
}
function getLogger( module ){
    return new Logger(module);
}

module.exports = getLogger;

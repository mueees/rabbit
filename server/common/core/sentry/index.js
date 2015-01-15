var raven = require('raven'),
    config = require('config'),
    ENV = process.env.NODE_ENV;

var client = new raven.Client(config.get("raven:key"));

function canSend(){
    return true;
    //return (ENV == 'live');
}

function getRaven( module ){
    var pathModule = module.filename.split("/").slice(-2).join('/');

    function extendOptions(options) {
        options = options || {};
        if(!options.extra) options.extra = {};
        options.extra.pathModule = pathModule;
        return options;
    }

    return {
        message: function (message, options) {
            if(!canSend()) return false;
            extendOptions(options);
            client.captureMessage(message, options);
        },
        error: function (error, options) {
            if(!canSend()) return false;
            extendOptions(options);
            client.captureError(message, options);
        }
    }
}
module.exports = getRaven;

/*
 debug (the least serious)
 info
 warning
 error
 fatal (the most serious)

 client.captureMessage("Another message", {tags: {'key': 'value'}})
 client.captureQuery('SELECT * FROM `awesome`', 'mysql');
 client.captureMessage("Another message", {extra: {'key': 'value'}})
 client.captureError(Error error[[, Object options], Function callback])
 */
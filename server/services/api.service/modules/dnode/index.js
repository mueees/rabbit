var dnode = require('dnode'),
    logger = require('common/core/logs')(module),
    config = require('config');

var auth = null;

var d = dnode.connect(config.get('services:auth:port'));

d.on('fail', function (remote) {
    logger.error("Api lost connect with auth service");
    auth = null;
});

d.on('error', function (remote) {
    logger.info("Api lost connect with auth service");
    auth = null;
});

d.on('remote', function (remote) {
    logger.info("Api was connected to auth service");
    auth = remote;
});

exports.getAuthService = function () {
    return auth;
};
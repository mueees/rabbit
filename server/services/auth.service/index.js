var dnode = require('dnode'),
    logger = require('common/core/logs')(module),
    Api = require('./api'),
    config = require('config');

var server = dnode(new Api());
server.listen(config.get('services:auth:port'));
logger.info("Service listen " + config.get('services:auth:port') + " port");
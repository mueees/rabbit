var dnode = require('dnode'),
    logger = require('common/core/logs')(module),
    api = require('./api'),
    config = require('config');

var server = dnode(api);
server.listen(config.get('services:auth:port'));
logger.info("Service listen " + config.get('services:auth:port') + " port");
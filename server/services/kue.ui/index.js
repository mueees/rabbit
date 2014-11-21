var kue = require('kue'),
    config = require('config'),
    logger = require('common/core/logs')(module);

kue.createQueue();
kue.app.listen(config.get("kue:port"));
logger.info('Kue ui started on ' + config.get("kue:port") + ' port. http://localhost:' + config.get("kue:port"));
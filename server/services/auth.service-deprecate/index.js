var dnode = require('dnode'),
    logger = require('common/core/logs')(module),
    api = require('./api'),
    cronJob = require('cron').CronJob,
    config = require('config');

/**
* Remove expired tokens by cron
* Every hours
* */
new cronJob('00 00 * * * *', function(){
    api.removeExpiredTokens().then(function () {
        logger.info("Remove tokens by cron", {
            extra: {
                time: new Date()
            }
        });
    }, function (err) {
        logger.error("Cannot remove expired tokens", {
            extra: {
                err: err
            }
        });
    });
}, null, true);

var server = require('common/core/service/server')(config.get('services:auth:port'), api);
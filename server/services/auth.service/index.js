var dnode = require('dnode'),
    logger = require('common/core/logs')(module),
    sentry = require('common/core/sentry')(module),
    api = require('./api'),
    cronJob = require('cron').CronJob,
    config = require('config');

/**
* Remove expired tokens by cron
* Every hours
* */
new cronJob('00 00 * * * *', function(){
    api.removeExpiredTokens().then(function () {
        sentry.message("Remove tokens by cron", {
            level: 'info',
            extra: {
                time: new Date()
            }
        });
    }, function (err) {
        sentry.message("Cannot remove expired tokens", {
            level: 'error',
            extra: {
                err: err
            }
        });
    });
}, null, true);

var server = require('common/core/service/server')(config.get('services:auth:port'), api);
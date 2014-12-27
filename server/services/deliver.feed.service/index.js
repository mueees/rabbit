var Service = require('./service'),
    logger = require('common/core/logs')(module),
    cronJob = require('cron').CronJob;
var service  = new Service();

service.deliverFeeds();

new cronJob('* 00,30 * * * *', function(){
    logger.info('Start cron job');
    service.deliverFeeds();
}, null, true);
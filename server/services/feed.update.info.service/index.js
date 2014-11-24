var logger = require('common/core/logs')(module),
    cronJob = require('cron').CronJob;


new cronJob('* 00,15,30,45 * * * *', function(){
    logger.info('Start update feed information');

    var worker = new Worker();
    worker.execute();

}, null, true);
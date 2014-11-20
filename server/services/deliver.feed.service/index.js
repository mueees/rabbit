var Service = require('./service'),
    cronJob = require('cron').CronJob;
var service  = new Service();

new cronJob('* * * * * *', function(){
    service.deliverFeeds();
}, null, true);
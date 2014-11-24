/*
 * Role of this service
 * 1. get updateFeed task
 * 2. execute this task ( download new posts )
 * 3. make task ( prepare post )
 * 4. save task
 * */
var Worker = require('./worker'),
    config = require('config'),
    configService = require('./config'),
    cluster = require('cluster'),
    logger = require('common/core/logs')(module),
    kue = require('kue');
var tasks = kue.createQueue();
var numCPUs = 2;

//init connection to mongo database
require('common/mongooseDb');

tasks.process(config.get("queues:tasks:updateFeed"), configService.workerCount, function (task, done) {
    var worker = new Worker(task, done);
    worker.execute();
});

tasks.on('error', function (err) {
    console.log('err');
});

/*
 * Proces all task
 * */
/*
if (cluster.isMaster) {
    logger.info('I am parent');
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        logger.error('worker ' + worker.process.pid + ' died');
    });
} else {
    logger.info('I am child');
    tasks.process(config.get("queues:tasks:updateFeed"), configService.workerCount, function (task, done) {
        var worker = new Worker(task, done);
        worker.execute();
    });
    tasks.on('error', function (err) {
        console.log('err');
    });
}
*/

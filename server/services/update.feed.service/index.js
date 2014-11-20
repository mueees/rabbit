/*
* Role of this service
* 1. get updateFeed task
* 2. execute this task ( download new posts )
* 3. make task ( prepare post )
* 4. save task
* */
var worker = require('./updateFeedWorker'),
    config = require('config'),
    configService = require('./config'),
    logger = require('common/core/logs')(module),
    kue = require('kue');
var tasks = kue.createQueue();
require('common/mongooseDb');

tasks.process(config.get("queues:tasks:updateFeed"), configService.workerCount, worker);
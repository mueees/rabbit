/*
 * Role of this service
 * Collect tasks
 * 1. countForSave or
 * 2. delayTime
 * and then save
 * */

 var config = require('config'),
    worker = require('./worker'),
    configService = require('./config'),
    kue = require('kue');
var tasks = kue.createQueue();

//init connection to mongo database
require('common/mongooseDb');

tasks.process(config.get("queues:tasks:savePost"), configService.workerCount, worker);
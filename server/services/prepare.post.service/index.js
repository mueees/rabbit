/*
 * Role of this service
 * 1. get prepareRowPost task
 * 2. execute this task
 *   Prepare post for saving.
 *      -Find image for this post
 * 3. make task for saving this post
 * 4. save task
 *
 * */

var worker = require('./worker'),
    config = require('config'),
    configService = require('./config'),
    logger = require('common/core/logs')(module),
    kue = require('kue');
var tasks = kue.createQueue();

//init connection to mongo database
require('common/mongooseDb');

/*
 * Proces all task
 * */
tasks.process(config.get("queues:tasks:prepareRowPost"), configService.workerCount, worker);
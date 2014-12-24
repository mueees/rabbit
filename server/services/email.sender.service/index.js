var config = require('config'),
    worker = require('./worker'),
    kue = require('kue');

var tasks = kue.createQueue();
tasks.process(config.get("queues:tasks:sendEmail"), worker);
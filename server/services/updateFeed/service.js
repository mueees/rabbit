var kue = require('kue'),
    worker = require('./worker'),
    config = require('./config');

var jobs = kue.createQueue();
jobs.process(config.kue.name, config.countWorker, worker);
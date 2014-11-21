var request = require('request'),
    Q = require('q'),
    kue = require('kue'),
    logger = require('common/core/logs')(module),
    config = require('config'),
    FeedModel = require('common/resource/feed.model'),
    tasks = kue.createQueue(),
    FeedParser = require('feedparser');


function Worker(task, done){
    this.task = task;
    this.rowPost = task.data;
    this.done = done;
}

Worker.prototype = {
    execute: function () {
        var _this = this;
        this.makeTask();
        this.saveTask().then(function () {
            logger.info("Task was saved");
            _this.done();
        }, function (err) {
            logger.error(err);
            _this.done(new Error("Cannot save task: savePost"));
        });
    },
    
    makeTask: function () {
        this.task = tasks.create(config.get("queues:tasks:savePost"), this.rowPost);
    },
    saveTask: function () {
        var def = Q.defer();
        this.task.save(function (err) {
            if(err){
                return def.reject(err);
            }
            def.resolve();
        });
        return def.promise;
    }
};

function execute (task, done){
    var worker = new Worker(task, done);
    worker.execute();
}

module.exports = execute;
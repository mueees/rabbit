var validator = require('validator'),
    async = require('async'),
    config = require('config'),
    logger = require('common/core/logs')(module),
    FeedModel = require('common/resource/feed.model'),
    PostModel = require('common/resource/post.model'),
    util = require('util'),
    _ = require('underscore'),
    url = require('url'),
    Q = require('q'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    kue = require('kue');

//link database
require("common/mongooseDb");


var Job = kue.Job;

/*Job.rangeByType(config.get("queues:tasks:updateFeed"), 'active', 0, 10, "DESC", function (err, jobs) {
    console.log(err);
    console.log(jobs);
});*/


Job.get('123', function (err, job) {
    console.log(err)
    console.log(job)
});
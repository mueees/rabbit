var validator = require('validator'),
    async = require('async'),
    config = require('config'),
    redis = require('redis'),
    logger = require('common/core/logs')(module),
    FeedModel = require('common/resource/feed.model'),
    PostModel = require('common/resource/post.model'),
    util = require('util'),
    _ = require('underscore'),
    url = require('url'),
    request = require('request'),
    Q = require('q'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    kue = require('kue');

//link database
require("common/mongooseDb");


var tasks = kue.createQueue();
var Job = kue.Job;

Job.rangeByType('updateFeed', 'inactive', 0, -1, "DESC", function (err, jobs) {
    if (err){
        console.log(err);
        return false;
    }
    console.log(jobs.length)
});
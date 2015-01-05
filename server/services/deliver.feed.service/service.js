/*
 * deliver.feed.service
 * Deliver feeds for update posts
 * */

/*
 * 1. Find all feeds
 * 2. Using statistic determine, what kind of feeds we should update now
 * 3. Create tasks for updating for this feeds
 * */

var config = require('config'),
    logger = require('common/core/logs')(module),
    kue = require('kue'),
    async = require('async');

var tasks = kue.createQueue();
var FeedModel = require('common/resource/feed.model');

/*Connect mongodb*/
require('common/mongooseDb');

/*
 * Get all feeds
 * */
function getAllFeeds(cb){
    FeedModel.find({}, {
        _id: true,
        url: true
    },function (err, feeds) {
        if(err) {
            logger.error(err);
            return cb(err);
        }
        cb(null, feeds);
    });
}

function Service(){}

Service.prototype.deliverFeeds = function () {
    //find all feeds
    logger.debug('Start deliver Feeds');
    async.waterfall([
        getAllFeeds,

    /*
     * Add feeds to queue
     * */
    function (feeds, cb) {
        var methods = [];
        feeds.forEach(function (feed) {
            methods.push(function (cbParallel) {
                tasks.create( config.get("queues:tasks:updateFeed"), {
                    _id: feed._id,
                    url: feed.url
                }).removeOnComplete(true).save(function (err) {
                    if(err) {
                        logger.error(err);
                        return cbParallel(err);
                    }

                    logger.debug('Save ' + config.get("queues:tasks:updateFeed") + " task");
                    cbParallel();
                });
            });
        });

        logger.debug("Start adding task");
        async.parallel(methods, function (err) {
            if(err) {
                logger.error(err);
                return cb(err);
            }
            logger.debug("All tasks was added");
            cb();
        })
    }
    ], function (err, results) {
        if(err){
            return logger.error('Cannot deliver feed to update',  err);
        }
        logger.info('Delivered feed to update at: ' + new Date());
    });
};

module.exports = Service;
require('common/mongooseDb');
var feeds = require('./feeds.json');
var FeedModel = require('common/resource/feed.model');
var logger = require('common/core/logs')(module);


/*
 * Remove all feeds
 * */
FeedModel.remove({}, function (error) {

    if(error){
        logger.error(error);
        console.log(error);
    }
    logger.info('remove all feeds');

    /*
     * Add some feed to DB
     * */
    FeedModel.create(feeds, function (err) {
        if(!err) logger.info('init.feeds.live complete');
    });

});
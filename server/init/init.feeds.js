/*
* Add one feed for testing
* */

var logger = require('common/core/logs')(module);

require('common/mongooseDb');
var FeedModel = require('common/resource/feed.model');

/*
* Remove all feeds
* */
FeedModel.remove({}, function (err) {

    if(!err) logger.info('remove all feeds');

    /*
     * Add some feed to DB
     * */
    var feed = new FeedModel();
    var feeds = [
        {
            url : "http://feeds.huffingtonpost.com/huffingtonpost/LatestNews",
            name: "failed"
        },
        {
            url : "http://dou.ua/forums/feed/",
            name: "right"
        }
    ];

    FeedModel.create(feeds, function (err) {
        if(!err) logger.info('init.feed complete');
    });

});
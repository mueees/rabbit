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
    var feed = new FeedModel({
        name: "Samiy sok",
        url: 'http://ibigdan.livejournal.com/data/rss'
    });

    feed.save(function (err) {
        if(!err) logger.info('init.feed complete');
    });

});


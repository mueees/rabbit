var feeds = require('./feeds.json');
var FeedModel = require('common/resource/feed.model');
var Q = require('q');
var logger = require('common/core/logs')(module);

/*init database*/
require('common/mongooseDb');

function initFeeds() {
    var def = Q.defer();
    FeedModel.remove({}, function (err) {

        if(err){
            logger.error(err);
            return def.reject(err);
        }
        logger.info('Remove all feeds');

        /*
         * Add some feed to DB
         * */
        FeedModel.create(feeds, function (err) {
            if(err) {
                logger.error(err);
                return def.reject(err);
            }

            logger.info('init.feeds.live complete');
            def.resolve();
        });

    });
    return def.promise;
}

module.exports = initFeeds;

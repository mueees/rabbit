var validator = require('validator'),
    async = require('async'),
    logger = require('common/core/logs')(module),
    FeedModel = require('common/resource/feed.model'),
    util = require('util'),
    url = require('url'),
    Q = require('q'),
    ServiceError = require('common/core/errors/service.error').ServiceError;

require('common/mongooseDb');

var api = {

    /*
     * Main method, that use api.service
     * Determine what is query - url or simple string
     * Run propreaty search algorithm
     *
     * */
    getFeeds: function (query, cb) {

        var isUrl = validator.isURL(query, {
            require_protocol: true
        });

        console.log("THIS IS QUERY:");
        console.log(query);
        console.log(validator.isURL(query));

        if(isUrl){
            /*
             * Parallel:
             * 2. Try to download feed by direct link
             * 3. Get domain and try to find feed by string query
             * */
            var getFeedsByDirectUrlPromise = FeedModel.discoverFeed({
                url: query
            });
            var getFeedsByStringQueryPromise = api.getFeedsByStringQuery(api.getDomain(query));

            async.parallel([
                function (cb) {
                    getFeedsByDirectUrlPromise.then(function (feed) {
                        cb(null, feed);
                    }, function (err) {
                        cb(null, err);
                    });
                },
                function (cb) {
                    getFeedsByStringQueryPromise.then(function (feeds) {
                        cb(null, feeds);
                    }, function (err) {
                        cb(null, err);
                    });
                }
            ], function (err, results) {
                var feedByDirectUrl = (results[0].type && results[0].type == "error") ? null : results[0];
                var existingFeeds = (results[1].type && results[1].type == "error") ? [] : results[1];

                if(feedByDirectUrl){
                    var posts = feedByDirectUrl.posts;
                    feedByDirectUrl = feedByDirectUrl.toObject();
                    feedByDirectUrl.posts = posts;
                }

                cb(null, {
                    //existing feeds
                    feeds: existingFeeds,

                    //search by direct link to feed
                    direct: feedByDirectUrl,

                    //feeds that belong to site
                    sites: []
                });
            });

        }else{
            var existingFeedByStringQuery = api.getFeedsByStringQuery(query);
            existingFeedByStringQuery.then(function (feeds) {
                cb(null, {
                    feeds: feeds,
                    direct: [],
                    sites: []
                });
            }, function () {
                cb(null, {
                    feeds: [],
                    direct: [],
                    sites: []
                });
            })
        };
    },

    /*
     * Get domain name from url
     * */
    getDomain: function (queryUrl) {
        return url.parse(queryUrl).host;
    },

    /*
     * Search try to find existing feeds by query
     * Search in
     *   - feed url
     *   - feed name
     * */
    getFeedsByStringQuery: function (query) {
        var defer = Q.defer();

        FeedModel.find({
            $or: [
                {
                    'name': {
                        $regex: query,
                        $options: 'i'
                    }
                },
                {
                    'url': {
                        $regex: query,
                        $options: 'i'
                    }
                }
            ]
        }, function (err, feeds) {
            if(err){
                logger.error(err);
                return defer.reject({
                    type: 'error',
                    message: 'Cannot find feeds'
                });
            }
            feeds = feeds.map(function (d) {
                var plainD = d.toObject();
                return {
                    _id: plainD._id,
                    name: plainD.name,
                    url: plainD.url
                }
            });
            defer.resolve(feeds);
        });

        return defer.promise;
    }
};

module.exports = api;
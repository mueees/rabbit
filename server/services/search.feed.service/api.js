var validator = require('validator'),
    async = require('async'),
    logger = require('common/core/logs')(module),
    FeedModel = require('common/resource/feed.model'),
    util = require('util'),
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
        api.getFeedsByStringQuery(query).then(function (feedsByQuery) {
            cb(null, {
                //existing feeds
                feeds: feedsByQuery,

                //search by direct link to feed
                direct: [],

                //feeds that belong to site
                sites: []
            })
        }, function (err) {
            cb(err);
        });
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
                return defer.reject(err);
            }
            defer.resolve(feeds);
        });

        return defer.promise;
    }
};

module.exports = api;
var validator = require('validator'),
    async = require('async'),
    logger = require('common/core/logs')(module),
    FeedModel = require('common/resource/feed.model'),
    util = require('util'),
    ServiceError = require('common/core/errors/service.error').ServiceError;

require('common/mongooseDb');

var api = {

    /*
    * Main method, that use api.service
    * Determine what is query - url or simple string
    * Run propreaty search algorithm
    *
    * */
    getFeeds: function (query) {


        return {
            //existing feeds
            feeds: [],

            //search by direct link to feed
            direct: [],

            //feeds that belong to site
            sites: []
        }
    },

    /*
    * Search try to find existing feeds by query
    * Search in
    *   - feed url
    *   - feed name
    * */
    getFeedsByStringQuery: function (query) {

    }
};

module.exports = api;
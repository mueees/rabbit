var validator = require('validator'),
    async = require('async'),
    logger = require('common/core/logs')(module),
    FeedModel = require('common/resource/feed.model'),
    util = require('util'),
    url = require('url'),
    Q = require('q');

//link database
require("common/mongooseDb");

function fakePromise() {
    var defer = Q.defer();
    setTimeout(function () {
        console.log("Fake done");
        defer.resolve();
    }, 5000);
    return defer.promise;
}

var discover = FeedModel.discoverFeed({
    url: 'http://ibigdan.livejournal.com/data/rss1'
});

var p1 = fakePromise();

async.parallel([
    function (cb) {
        p1.then(function (data) {
            cb(null, data);
        }, function (data) {
            cb(null, data);
        });
    },
    function (cb) {
        discover.then(function (data) {
            cb(null, data);
        }, function (data) {
            cb(null, data);
        });
    }
], function (err, results) {
    debugger;
});
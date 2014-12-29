var dnode = require('dnode'),
    logger = require('common/core/logs')(module),
    api = require('./api'),
    config = require('config');

/*api.getFeeds('http://ibigdan.livejournal.com/data/rss1', function (err, result) {
    debugger;
});*/

var server = require('common/core/service/server')(config.get('services:search:port'), api);
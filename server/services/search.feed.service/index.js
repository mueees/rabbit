var dnode = require('dnode'),
    logger = require('common/core/logs')(module),
    api = require('./api'),
    config = require('config');

var server = require('common/core/service/server')(config.get('services:search:port'), api);
var mongoose = require('mongoose'),
    config = require('config'),
    logger = require('common/core/logs')(module);

mongoose.connect('mongodb://' + config.get('db:ip') + '/' + config.get('db:nameDatabase'));

mongoose.connection.on('error', function (err) {
    logger.error(err);
});

mongoose.connection.on('open', function () {
    logger.info('Establish connect to mongodb');
});
var _ = require('underscore'),
    logger = require('common/core/logs')(module),
    HttpError = require('../../errors/HttpError').HttpError,
    searchService = require("../../modules/searchServiceRemote");

function Controller(){}

_.extend(Controller.prototype, {
    find: function (req, res, next) {
        searchService.execute('getFeeds', req.body.search , function (err, result) {
            if(err){
                logger.error('Search error', err);
                res.finish.resolve(err);
                return next(new HttpError(400, err));
            }

            res.status(200);
            res.send(result);
            res.finish.resolve(result);
        });
    }
});

module.exports = new Controller();
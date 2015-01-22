var HttpError = require('../errors/HttpError').HttpError,
    logger = require('common/core/logs')(module),
    UserModel = require('common/resource/user.model');

module.exports = function(req, res, next){
    var token = req.query.token;

    if( !token ){
        logger.error('No token');
        return next(new HttpError(401, "You are not login"));
    }

    UserModel.getUserByToken(token, function (err, user) {
        if(err){
            logger.error("Cannot find user", {
                error: err
            });
            return next(new HttpError(400, "Cannot find user"));
        }

        if(!user){
            logger.error("Cannot find user", {
                token: token
            });
            return next(new HttpError(400, "You are not login"));
        }

        req.user = user;
        next();
    });

};
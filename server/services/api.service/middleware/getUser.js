var HttpError = require('../errors/HttpError').HttpError,
    logger = require('common/core/logs')(module),
    UserModel = require('common/resource/user.model');

module.exports = function(req, res, next){
    var token = req.query.token;

    if( !token ){
        return next();
    }

    UserModel.getUserByToken(token, function (err, user) {
        if(err){
            logger.error("Cannot find user", {
                error: err
            });
            return next();
        }

        if(!user){
            return next();
        }

        req.user = user;
        next();
    });
};
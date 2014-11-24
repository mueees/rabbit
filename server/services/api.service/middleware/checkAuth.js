var HttpError = require('../errors/HttpError').HttpError,
    logger = require('common/core/logs')(module),
    getAuthService = require('../modules/dnode/index').getAuthService;

module.exports = function(req, res, next){
    var token = req.query.token;
    var authService = getAuthService();

    if( !token ){
        logger.error('No token');
        return next(new HttpError(401, "You are not login"));
    }

    if(authService){
        authService.isAuth(token, function (response) {
            next();
        });
    }else{
        return next(new HttpError(401, "Cannot check login"));
    }
};
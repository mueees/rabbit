var HttpError = require('../errors/HttpError').HttpError,
    logger = require('common/core/logs')(module),
    authService = require('../modules/authServiceRemote');

module.exports = function(req, res, next){
    var token = req.query.token;

    if( !token ){
        logger.error('No token');
        return next(new HttpError(401, "You are not login"));
    }
    authService.execute('getUserByToken', token, function (err, user) {
            if(err){
                logger.error(err.message);
                if( err.status == 500 ){
                    return next(new HttpError(400, "Server problem"));
                }else{
                    return next(new HttpError(401, "You are not login"));
                }
            }
            req.user = user;
            next();
        }
    );
};
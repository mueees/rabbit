var HttpError = require('../errors/HttpError').HttpError,
    logger = require('common/core/logs')(module),
    authService = require('../modules/authServiceRemote');

module.exports = function(req, res, next){
    var token = req.query.token;

    if( !token ){
        return next();
    }

    authService.execute('getUserByToken', token, function (err, user) {
            if(err){
                logger.error(err.message);
                if( err.status == 500 ){
                    return next(new HttpError(400, "Server problem"));
                }else{
                    /* Cannot find user*/
                    return next();
                }
            }
            req.user = user;
            next();
        }
    );
};
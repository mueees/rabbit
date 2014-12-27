var UserModel = require('common/resource/user.model');
var Q = require('q');
var logger = require('common/core/logs')(module);

/*init database*/
require('common/mongooseDb');

function initUser() {
    var def = Q.defer();
    UserModel.remove({}, function (err) {

        if(err){
            logger.error(err);
            return def.reject(err);
        }
        logger.info('Remove all users');

        /*
         * Add some feed to DB
         * */
        UserModel.create({
            "email": "mue.miv@gmail.com",
            "password": "6d9b20142799d45bdb02936a0d1cf94c5b8ea053",
            "status": "200"
        }, function (err) {
            if(err) {
                logger.error(err);
                return def.reject(err);
            }

            logger.info('init.user.live complete');
            def.resolve();
        });

    });
    return def.promise;
}

module.exports = initUser;

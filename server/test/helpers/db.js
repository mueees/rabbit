var UserModel = require('common/resource/user.model'),
    Q = require('q'),
    authApi = require('services/auth.service/api'),
    async = require('async'),
    logger = require("common/core/logs")(module);

var api = {
    db: {
        clearUsers: function () {
            var def = Q.defer();
            UserModel.remove({}, function (err) {
                if(err){
                    def.reject();
                    return logger.error("Cannot clear users");
                }
                logger.info("Users was cleared");
                def.resolve();
            });
            return def.promise;
        },
        registerAndConfirmUser: function (options) {
            var def = Q.defer();
            var email = options.email || "test@signup.com";
            var pass = options.pass || "12345678";
            var confirmationId = null;
            var user = null;
            async.waterfall([
                //register user
                function (cb) {
                    authApi.signup(email, pass, function (err, user) {
                        confirmationId = user.confirmationId;
                        user = user;
                        cb();
                    });
                },
                //confirm user by token
                function (cb) {
                    authApi.confirmUser(confirmationId, function (err) {
                        cb();
                    });
                }
            ], function () {
                def.resolve(user);
            });
            return def.promise;
        },
        registerConfirmSignin: function (options) {
            var def = Q.defer();
            var email = options.email || "test@signup.com";
            var pass = options.pass || "12345678";

            api.db.registerAndConfirmUser({
                email: email,
                pass: pass
            }).then(function () {
                authApi.signin(email, pass, function (err, token) {
                    def.resolve(token);
                });
            });
            return def.promise;
        }
    }
};

module.exports = api;
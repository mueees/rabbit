var UserModel = require('common/resource/user.model'),
    Q = require('q'),
    authApi = require('services/auth.service/api'),
    async = require('async'),
    logger = require("common/core/logs")(module);



var api = {
    db: {
        user: {
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
            registerUser: function (options) {
                var def = Q.defer();
                options = options || {};
                var email = options.email || "test@signup.com";
                var pass = options.pass || "12345678";
                authApi.signup(email, pass, function (err, user) {
                    def.resolve(user);
                });
                return def.promise;
            },
            registerAndConfirmUser: function (options) {
                var def = Q.defer();
                options = options || {};
                var email = options.email || "test@signup.com";
                var pass = options.pass || "12345678";
                var confirmationId = null;
                var userData = null;
                async.waterfall([
                    //register user
                    function (cb) {
                        authApi.signup(email, pass, function (err, user) {
                            confirmationId = user.confirmationId;
                            userData = user;
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
                    def.resolve(userData);
                });
                return def.promise;
            },
            registerConfirmSignin: function (options) {
                var def = Q.defer();
                options = options || {};
                var email = options.email || "test@signup.com";
                var pass = options.pass || "12345678";

                api.db.user.registerAndConfirmUser({
                    email: email,
                    pass: pass
                }).then(function (user) {
                    authApi.signin(email, pass, function (err, token) {
                        def.resolve({
                            user: user,
                            token: token
                        });
                    });
                });
                return def.promise;
            }
        },
        category: {
            add: function (options) {
                var def = Q.defer();
                options = options || {};
                options.categoryName = options.categoryName || "test";
                if( !options.userId ){
                    new Error("Cannot find required data");
                }
                UserModel.addCategory(options.userId, options.categoryName, function (err, user, category) {

                    def.resolve({
                        category: category,
                        user: user
                    });
                });
                return def.promise;
            },
            userAuthCreateCategory: function () {
                var def = Q.defer();
                api.db.user.registerConfirmSignin()
                    .then(function (data) {
                        api.db.category.add({
                            userId: data.user._id
                        }).then(function (data) {
                            def.resolve({
                                category: data.category,
                                user: data.user
                            })
                        })
                    });
                return def.promise;
            }
        }
    }
};

module.exports = api;
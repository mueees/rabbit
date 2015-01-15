var UserModel = require('common/resource/user.model'),
    FeedModel = require('common/resource/feed.model'),
    PostModel = require('common/resource/post.model'),
    Q = require('q'),
    authApi = require('services/auth.service/api'),
    async = require('async'),
    logger = require("common/core/logs")(module);


var api = {
    db: {
        clearDb: function () {
            var def = Q.defer();
            api.db.user.clearUsers()
                .then(api.db.post.clearPosts)
                .then(api.db.feed.clearFeeds)
                .then(function () {
                    def.resolve();
                });
            return def.promise;
        },
        user: {
            clearUsers: function () {
                var def = Q.defer();
                UserModel.remove({}, function (err) {
                    if (err) {
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
            },
            addTokens: function (user, tokens) {
                var def = Q.defer();

                if (!user) {
                    def.reject("Cannot find user");
                }

                UserModel.findById(user._id, function (err, user) {
                    user.tokens.concat(tokens);
                    user.save(function (err) {
                        if(err){
                            return def.reject(err);
                        }
                        def.resolve(user);
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

                if (!options.userId) {
                    def.reject("Category add : Cannot find userId");
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
        },
        feed: {
            /*Add fake feed to feed collection
             * It's not method for adding feedId to user category
             * */
            addFakeFeed: function (options) {
                var def = Q.defer();
                options = options || {};

                options.name = options.name || "Fake feed name";
                options.url = options.url || "Fake feed url";

                FeedModel.create({
                    name: options.name,
                    url: options.url
                }, function (err, feed) {
                    def.resolve(feed);
                });

                return def.promise;
            },
            auth_addCategory_addFeed: function () {
                var def = Q.defer();
                var category = null;
                var user = null;
                var dataFeed = null;
                api.db.category.userAuthCreateCategory().then(function (data) {
                    category = data.category;
                    user = data.user;
                    return api.db.feed.addFakeFeed().then(function (feed) {
                        dataFeed = feed;
                    })
                }).then(function () {
                    var def = Q.defer();
                    user.categories[0].feeds.push({
                        name: dataFeed.name,
                        feedId: dataFeed._id
                    });
                    user.save(function () {
                        def.resolve();
                    });
                    return def.promise;
                }).then(function () {
                    def.resolve({
                        user: user,
                        category: category,
                        feed: dataFeed
                    })
                });

                return def.promise;
            },
            clearFeeds: function () {
                var def = Q.defer();
                FeedModel.remove({}, function () {
                    def.resolve();
                });
                return def.promise;
            }
        },
        post: {
            add: function (options) {
                var def = Q.defer();
                options = options || {};

                if(!options.feedId){
                    def.reject("Cannot find feed id");
                }
                PostModel.create({
                    feedId: options.feedId,
                    link: "Fake link",
                    guid: "Fake guid"
                }, function (err, post) {

                    if(err){
                        return def.reject(err);
                    }

                    def.resolve({
                        post: post
                    })
                });
                return def.promise;
            },

            clearPosts: function () {
                var def = Q.defer();
                PostModel.remove({}, function () {
                    def.resolve();
                });
                return def.promise;
            }
        }
    }
};

module.exports = api;
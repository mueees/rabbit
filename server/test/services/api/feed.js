var helpers = require('test/helpers'),
    Q = require('q'),
    UserModel = require('common/resource/user.model'),
    feedController = require('services/api.service/controllers/rss/feed');

var response = {
        send: function(){},
        status: function () {}
    },
    next = function () {},
    errorHandler = function (err) {
        console.log("Error handler");
        console.log(err);
        return false;
    };

describe("POST /rss/feed/add", function () {

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req,
            categoryData,
            userData,
            feedData;

        beforeEach(function (done) {
            req = {
                body: {},
                user: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(function () {
                    return helpers.db.feed.addFakeFeed().then(function (feed) {
                        feedData = feed;
                    });
                })
                .then(helpers.db.category.userAuthCreateCategory)
                .then(function (data) {
                    categoryData = data.category;
                    userData = data.user;

                    req.body.categoryId = data.category._id;
                    req.body.feedId = feedData._id;
                    req.user._id = data.user._id;

                    feedController.add(req, response, next, def);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                })
        });

        it("should add feed to user category", function (done) {
            assert.notOk(responseData.message);
            UserModel.isExistCategory(userData._id, categoryData._id, function (err, category, user) {
                if(String(category.feeds[0].feedId) == String(feedData._id)){
                    done();
                }else{
                    done(new Error("should add feed to user category"));
                }
            });
        });
    });

    describe("Fail request: without feedId", function () {
        var responseData,
            promise,
            def,
            req;

        beforeEach(function (done) {
            req = {
                body: {
                    categoryId: "Fake category id"
                },
                user: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.user.registerConfirmSignin)
                .then(function (data) {
                    req.user._id = data.user._id;
                    feedController.add(req, response, next, def);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                })
        });

        it("should not add feed to user category", function (done) {
            assert.ok(responseData.message);
            assert.equal("Doesn't have category or feed id", responseData.message);
            done();
        });
    });

    describe("Fail request: without categoryId", function () {
        var responseData,
            promise,
            def,
            req;

        beforeEach(function (done) {
            req = {
                body: {
                    feedId: "Fake feed id"
                },
                user: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.user.registerConfirmSignin)
                .then(function (data) {
                    req.user._id = data.user._id;
                    feedController.add(req, response, next, def);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                })
        });

        it("should not add feed to user category", function (done) {
            assert.ok(responseData.message);
            assert.equal("Doesn't have category or feed id", responseData.message);
            done();
        });
    });

    describe("Fail request: wrong feed Id", function () {
        var responseData,
            promise,
            def,
            req;

        beforeEach(function (done) {
            req = {
                body: {
                    feedId: "Fake feed id",
                    categoryId: "Fake feed id"
                },
                user: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.user.registerConfirmSignin)
                .then(function (data) {
                    req.user._id = data.user._id;
                    feedController.add(req, response, next, def);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                })
        });

        it("should create category", function (done) {
            assert.ok(responseData.message);
            assert.equal("Cannot find feed by id", responseData.message);
            done();
        });
    });

});

describe("POST /rss/feed/remove", function () {

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req,
            categoryData,
            userData,
            feedData;

        beforeEach(function (done) {
            req = {
                body: {

                },
                user: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.feed.auth_addCategory_addFeed)
                .then(function (data) {
                    categoryData = data.category;
                    userData = data.user;

                    req.body.feedId = data.feed._id;
                    req.user._id = data.user._id;

                    feedController.remove(req, response, next, def);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                })
        });

        it("should remove feed from category", function (done) {
            assert.notOk(responseData.message);
            UserModel.isExistCategory(userData._id, categoryData._id, function (err, category, user) {
                if( category.feeds.length === 0 ){
                    done()
                }else{
                    done(new Error("should remove feed from category"));
                }

            });
        });
    });

    describe("Fail request: without feed id", function () {
        var responseData,
            promise,
            def,
            req,
            categoryData,
            userData,
            feedData;

        beforeEach(function (done) {
            req = {
                body: {},
                user: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.feed.auth_addCategory_addFeed)
                .then(function (data) {
                    categoryData = data.category;
                    userData = data.user;
                    req.user._id = data.user._id;
                    feedController.remove(req, response, next, def);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                })
        });

        it("should not remove feed from category", function (done) {
            assert.ok(responseData.message);
            UserModel.isExistCategory(userData._id, categoryData._id, function (err, category, user) {
                if( category.feeds.length === 1 ){
                    done()
                }else{
                    done(new Error("should not remove feed from category"));
                }
            });
        });
    });

});

describe("POST /rss/feed/change/category", function () {

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req,
            categoryData,
            userData,
            feedData;

        beforeEach(function (done) {
            req = {
                body: {},
                user: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.feed.auth_addCategory_addFeed, errorHandler)
                .then(function (data) {
                    feedData = data.feed;
                    return helpers.db.category.add({
                        userId: data.user._id
                    }).then(function (data) {
                        categoryData = data.category;
                        userData = data.user;
                    })
                }, errorHandler)
                .then(function () {
                    req.user._id = userData._id;
                    req.body.feedId = feedData._id;
                    req.body.categoryId = categoryData._id;
                    feedController.changeCategory(req, response, next, def);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                }, errorHandler)
        });

        it("should remove feed from category", function (done) {
            assert.notOk(responseData.message);
            UserModel.isExistCategory(userData._id, categoryData._id, function (err, category, user) {
                if( category.feeds.length === 1 ){
                    done();
                }else{
                    done(new Error("feed should change category"));
                }
            });
        });
    });

});

describe("POST /rss/feed/edit", function () {

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req,
            userData,
            categoryData,
            newName = "new name";

        beforeEach(function (done) {
            req = {
                body: {},
                user: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.feed.auth_addCategory_addFeed, errorHandler)
                .then(function (data) {

                    userData = data.user;
                    categoryData = data.category;

                    req.user._id = data.user._id;
                    req.body = {
                        _id: data.feed._id,
                        name: newName
                    };

                    feedController.edit(req, response, next, def);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                }, errorHandler);
        });

        it("should change feed name", function (done) {
            assert.notOk(responseData.message);
            UserModel.isExistCategory(userData._id, categoryData._id, function (err, category, user) {
                if( category.feeds[0].name == newName ){
                    done()
                }else{
                    done(new Error("feed should change category"));
                }
            });
        });
    });

    describe("Fail request: without name", function () {
        var responseData,
            promise,
            def,
            req,
            userData,
            categoryData,
            newName = "";

        beforeEach(function (done) {
            req = {
                body: {},
                user: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.feed.auth_addCategory_addFeed, errorHandler)
                .then(function (data) {

                    userData = data.user;
                    categoryData = data.category;

                    req.user._id = data.user._id;
                    req.body = {
                        _id: data.feed._id,
                        name: newName
                    };

                    feedController.edit(req, response, next, def);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                }, errorHandler);
        });

        it("should change feed name", function (done) {
            assert.ok(responseData.message);
            UserModel.isExistCategory(userData._id, categoryData._id, function (err, category, user) {
                if( category.feeds[0].name != newName ){
                    done()
                }else{
                    done(new Error("feed should change category"));
                }
            });
        });
    });

});

describe("POST /rss/feed/:id", function () {
    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req,
            userData;

        beforeEach(function (done) {
            req = {
                body: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.feed.auth_addCategory_addFeed, errorHandler)
                .then(function (data) {
                    userData = data.user;

                    //req.user._id = data.user._id;
                    req.params = {
                        id: data.feed._id
                    };

                    feedController.getFeedById(req, response, next);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                }, errorHandler);
        });

        it("should exist feed but not followed", function (done) {
            assert.ok(responseData);
            assert.notOk(responseData.isFollowed);
            done();
        });
    });

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req,
            userData;

        beforeEach(function (done) {
            req = {
                body: {},
                user: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.feed.auth_addCategory_addFeed, errorHandler)
                .then(function (data) {
                    userData = data.user;

                    req.user._id = data.user._id;
                    req.params = {
                        id: data.feed._id
                    };

                    feedController.getFeedById(req, response, next);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                }, errorHandler);
        });

        it("feed should be followed", function (done) {
            assert.ok(responseData);
            assert.ok(responseData.isFollowed);
            done();
        });
    });
});
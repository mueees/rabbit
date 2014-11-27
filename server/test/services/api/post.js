var helpers = require('test/helpers'),
    Q = require('q'),
    PostModel = require('common/resource/post.model'),
    postController = require('services/api.service/controllers/rss/post');

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


describe("Post api test", function () {
    var global = {
        user: null,
        category: null,
        feed: null
    };

    before(function (done) {
        /*
         * create confirm signin user
         * add feed ( not to user category )
         * */
        helpers.db.clearDb()
            .then(helpers.db.feed.auth_addCategory_addFeed)
            .then(function (data) {
                global = {
                    user: data.user,
                    category: data.category,
                    feed: data.feed
                };
                done();
            })
    });

    describe("POST /rss/post/mark/read", function () {

        describe("Success request", function () {
            var responseData,
                promise,
                def,
                post,
                req;

            beforeEach(function (done) {
                req = {
                    body: {},
                    user: {}
                };
                def = Q.defer();
                promise = def.promise;

                helpers.db.post.clearPosts()
                    .then(function () {
                        return helpers.db.post.add({
                            feedId: global.feed._id
                        }).then(function (data) {
                            post = data.post;
                        }, errorHandler)
                    }, errorHandler)
                    .then(function () {
                        req.body._id = post._id;
                        req.user._id = global.user._id;
                        postController.read(req, response, next, def);
                        promise.then(function (data) {
                            responseData = data;
                            done();
                        });
                    }, errorHandler)
            });

            it("should check post as read for current user", function (done) {
                assert.notOk(responseData.message);
                PostModel.findById(post._id, function (err, post) {
                    if(post.users[0].isRead == true){
                        done();
                    }else{
                        done(new Error('should check post as read for current user'));
                    }
                });
            });
        });

        describe("Fail request: without post id", function () {
            var responseData,
                promise,
                def,
                post,
                req;

            beforeEach(function (done) {
                req = {
                    body: {},
                    user: {}
                };
                def = Q.defer();
                promise = def.promise;

                helpers.db.post.clearPosts()
                    .then(function () {
                        return helpers.db.post.add({
                            feedId: global.feed._id
                        }).then(function (data) {
                            post = data.post;
                        }, errorHandler)
                    }, errorHandler)
                    .then(function () {
                        req.user._id = global.user._id;
                        postController.read(req, response, next, def);
                        promise.then(function (data) {
                            responseData = data;
                            done();
                        });
                    }, errorHandler)
            });

            it("should not check post as read for current user", function (done) {
                assert.ok(responseData.message);
                PostModel.findById(post._id, function (err, post) {
                    //console.log(post);
                    if(post.users.length === 0){
                        done();
                    }else{
                        done(new Error('should not check post as read for current user'));
                    }
                });
            });
        });

    });

    describe("POST /rss/post/mark/unread", function () {

        describe("Success request", function () {
            var responseData,
                promise,
                def,
                post,
                req;

            beforeEach(function (done) {
                req = {
                    body: {},
                    user: {}
                };
                def = Q.defer();
                promise = def.promise;

                helpers.db.post.clearPosts()
                    .then(function () {
                        return helpers.db.post.add({
                            feedId: global.feed._id
                        }).then(function (data) {
                            post = data.post;
                        }, errorHandler)
                    }, errorHandler)
                    .then(function () {
                        req.body._id = post._id;
                        req.user._id = global.user._id;
                        postController.unread(req, response, next, def);
                        promise.then(function (data) {
                            responseData = data;
                            done();
                        });
                    }, errorHandler)
            });

            it("should check post as unread for current user", function (done) {
                assert.notOk(responseData.message);
                PostModel.findById(post._id, function (err, post) {
                    if(post.users[0].isRead == false){
                        done();
                    }else{
                        done(new Error('should check post as unread for current user'));
                    }
                });
            });
        });

    });

    describe("POST /rss/post/readlater/check", function () {

        describe("Success request", function () {
            var responseData,
                promise,
                def,
                post,
                req;

            beforeEach(function (done) {
                req = {
                    body: {},
                    user: {}
                };
                def = Q.defer();
                promise = def.promise;

                helpers.db.post.clearPosts()
                    .then(function () {
                        return helpers.db.post.add({
                            feedId: global.feed._id
                        }).then(function (data) {
                            post = data.post;
                        }, errorHandler)
                    }, errorHandler)
                    .then(function () {
                        req.body._id = post._id;
                        req.user._id = global.user._id;
                        postController.check(req, response, next, def);
                        promise.then(function (data) {
                            responseData = data;
                            done();
                        });
                    }, errorHandler)
            });

            it("should check post for unreading later", function (done) {
                assert.notOk(responseData.message);
                PostModel.findById(post._id, function (err, post) {
                    if(post.users[0].readLater == true){
                        done();
                    }else{
                        done(new Error('should check post for unreading later'));
                    }
                });
            });
        });

    });

    describe("POST /rss/post/readlater/uncheck", function () {

        describe("Success request", function () {
            var responseData,
                promise,
                def,
                post,
                req;

            beforeEach(function (done) {
                req = {
                    body: {},
                    user: {}
                };
                def = Q.defer();
                promise = def.promise;

                helpers.db.post.clearPosts()
                    .then(function () {
                        return helpers.db.post.add({
                            feedId: global.feed._id
                        }).then(function (data) {
                            post = data.post;
                        }, errorHandler)
                    }, errorHandler)
                    .then(function () {
                        req.body._id = post._id;
                        req.user._id = global.user._id;
                        postController.uncheck(req, response, next, def);
                        promise.then(function (data) {
                            responseData = data;
                            done();
                        });
                    }, errorHandler)
            });

            it("should uncheck post for reading later", function (done) {
                assert.notOk(responseData.message);
                PostModel.findById(post._id, function (err, post) {
                    if(post.users[0].readLater == false){
                        done();
                    }else{
                        done(new Error('should check post as unread for current user'));
                    }
                });
            });
        });

    });

});
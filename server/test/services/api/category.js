var helpers = require('test/helpers'),
    Q = require('q'),
    categoryController = require('services/api.service/controllers/rss/category');

var response = {
        send: function(){},
        status: function () {}
    },
    next = function () {};

/*describe('POST /rss/category/add', function(){

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req;

        beforeEach(function (done) {
            req = {
                body: {
                    name: 'Test category'
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
                    categoryController.add(req, response, next, def);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                })
        });

        it("should create category", function (done) {
            assert.ok(responseData._id);
            assert.notOk(responseData.message);
            done();
        });
    });

    describe("Fail request: without name", function () {
        var responseData,
            promise,
            def,
            req;

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
                .then(helpers.db.user.registerConfirmSignin)
                .then(function (data) {
                    req.user._id = data.user._id;
                    categoryController.add(req, response, next, def);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                })
        });

        it("should not create category", function (done) {
            assert.notOk(responseData._id);
            assert.ok(responseData.message);
            done();
        });
    });

});

describe('POST /rss/category/edit', function(){

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req,
            categoryName = 'test',
            newCategoryName = 'new';

        beforeEach(function (done) {
            req = {
                body: {
                    name: 'Test category'
                },
                user: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.user.registerConfirmSignin)
                .then(function (data) {
                    helpers.db.category.add({
                        userId: data.user._id,
                        categoryName: categoryName
                    }).then(function (data) {
                        req.user._id = data.user._id;
                        req.body._id = data.category._id;
                        req.body.name = newCategoryName;

                        categoryController.edit(req, response, next, def);
                        promise.then(function (data) {
                            responseData = data;
                            done();
                        });
                    })
                })
        });

        it("should edit category", function (done) {
            assert.ok(responseData._id);
            assert.ok(responseData.name);
            assert.equal(newCategoryName, responseData.name);
            assert.notOk(responseData.message);
            done();
        });
    });

    describe("Fail request: without name", function () {
        var responseData,
            promise,
            def,
            req,
            categoryName = 'test',
            newCategoryName = '';

        beforeEach(function (done) {
            req = {
                body: {
                    name: 'Test category'
                },
                user: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.user.registerConfirmSignin)
                .then(function (data) {
                    helpers.db.category.add({
                        userId: data.user._id,
                        categoryName: categoryName
                    }).then(function (data) {
                        req.user._id = data.user._id;
                        req.body._id = data.category._id;
                        req.body.name = newCategoryName;

                        categoryController.edit(req, response, next, def);
                        promise.then(function (data) {
                            responseData = data;
                            done();
                        });
                    })
                })
        });

        it("should not edit category", function (done) {
            assert.notOk(responseData._id);
            assert.notOk(responseData.name);
            assert.ok(responseData.message);
            done();
        });
    });

});

describe('POST /rss/category/remove', function(){

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req;

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
                .then(helpers.db.category.userAuthCreateCategory)
                .then(function (data) {
                    req.user._id = data.user._id;
                    req.body._id = data.category._id;
                    categoryController.remove(req, response, next, def);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                })
        });

        it("should remove category", function (done) {
            assert.notOk(responseData.message);
            done();
        });


    })
});

describe('GET /rss/category/list', function(){

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req,
            user;

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
                .then(helpers.db.category.userAuthCreateCategory)
                .then(function (data) {
                    helpers.db.category.add({
                        userId: data.user._id
                    }).then(function () {
                        req.user._id = data.user._id;
                        categoryController.list(req, response, next, def);
                        promise.then(function (data) {
                            responseData = data;
                            done();
                        });
                    });
                })
        });

        it("should return category list", function (done) {
            assert.ok(responseData.data);
            assert.equal(2, responseData.data.length);
            done();
        });
    })
});

describe('GET /rss/category/list/feed', function(){

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req;

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
                .then(helpers.db.category.userAuthCreateCategory)
                .then(function (data) {
                    helpers.db.category.add({
                        userId: data.user._id
                    }).then(function () {
                        req.user._id = data.user._id;
                        categoryController.list(req, response, next, def);
                        promise.then(function (data) {
                            responseData = data;
                            done();
                        });
                    });
                })
        });

        it("should return category list with feeds", function (done) {
            assert.ok(responseData.data);
            assert.equal(2, responseData.data.length);
            done();
        });
    })
});*/

describe('GET /rss/category/list/listFeed' , function () {

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req,
            createdData;

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
                    createdData = data;
                    req.user._id = data.user._id;
                    categoryController.listFeed(req, response, next);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    });
                })
        });

        it("should return category list with feeds", function (done) {
            assert.equal(1, responseData.length);
            assert.equal(1, responseData[0].feeds.length);

            done();
        });

    })

});
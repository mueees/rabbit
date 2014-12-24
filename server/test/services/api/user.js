var authService = require('services/auth.service'),
    helpers = require('test/helpers'),
    Q = require('q'),
    userController = require('services/api.service/controllers/user'),
    UserModel = require('common/resource/user.model');


var response = {
        send: function(){},
        status: function () {}
    },
    next = function () {};

describe('POST /user/signup', function(){

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req;

        beforeEach(function (done) {
            req = {
                body: {
                    email: "test@gmail.com",
                    password: '123213123123'
                }
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers().then(function () {
                userController.signup(req, response, next);
                promise.then(function (data) {
                    responseData = data;
                    done();
                });
            })
        });

        it('User should exist', function(done){
            UserModel.findById(responseData.data._id, function (err, user) {
                assert.ok(user);
                assert.ok(user._id);
                done();
            });
        });
    });

    describe("Fail request", function () {
        var responseData,
            promise,
            def,
            req;

        beforeEach(function (done) {
            var req = {
                body: {
                    email: "test",
                    password: '123213123123'
                }
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers().then(function () {
                userController.signup(req, response, next);
                promise.then(function (data) {
                    responseData = data;
                    done();
                });
            })
        });

        it('User should not exist', function(done){
            assert.ok(responseData.message);
            assert.equal("Invalid Email", responseData.message);
            done();
        });
    });

});

describe('GET /user/confirmuser', function(){

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req;

        beforeEach(function (done) {
            req = {
                query: {}
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.user.registerUser)
                .then(function (user) {
                    req.query.confirmationId = user.confirmationId;
                    userController.confirmuser(req, response, next);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    })
                });
        });

        it('Should exist error', function(done){
            assert.notOk(responseData);
            done();
        });
    });

    describe("Error request: wrong confirmationId", function () {
        var responseData,
            promise,
            def,
            req;

        beforeEach(function (done) {
            req = {
                query: {
                    confirmationId: "123123132"
                }
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers().then(function () {
                userController.confirmuser(req, response, next);
                promise.then(function (data) {
                    responseData = data;
                    done();
                })
            });
        });

        it('Should exist error', function(done){
            assert.ok(responseData.message);
            assert.equal("Doesn't have user with this confirmationId", responseData.message);
            done();
        });
    });

    describe("Error request: without confirmationId", function () {
        var responseData,
            promise,
            def,
            req;

        before(function (done) {
            req = {query: {}};
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers().then(function () {
                userController.confirmuser(req, response, next);
                promise.then(function (data) {
                    responseData = data;
                    done();
                })
            });
        });

        it('Should exist error', function(done){
            assert.ok(responseData.message);
            assert.equal("Cannot find confirmationId", responseData.message);
            done();
        });
    });

});

describe("GET /user/signin", function () {

    describe("Success request", function () {
        var responseData,
            promise,
            def,
            req;

        before(function (done) {
            req = {
                body: {
                    email: "test@signup.com",
                    password: "12345678"
                }
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.user.registerAndConfirmUser)
                .then(function () {
                    userController.signin(req, response, next);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    })
                });

        });
        it('Should exist error', function(done){
            assert.ok(responseData.token);
            done();
        });
    });

    describe("Fail request: without email", function () {
        var responseData,
            promise,
            def,
            req;

        before(function (done) {
            req = {
                body: {
                    password: "12345678"
                }
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.user.registerAndConfirmUser)
                .then(function () {
                    userController.signin(req, response, next);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    })
                });

        });
        it('Should exist error', function(done){
            assert.ok(responseData.message);
            assert.equal("Wrong login or password" ,responseData.message);
            done();
        });
    });

    describe("Fail request: without password", function () {
        var responseData,
            promise,
            def,
            req;

        before(function (done) {
            req = {
                body: {
                    email: "test@signup.com"
                }
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.user.registerAndConfirmUser)
                .then(function (){
                    userController.signin(req, response, next);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    })
                });

        });
        it('Should exist error', function(done){
            assert.ok(responseData.message);
            assert.equal("Wrong login or password" ,responseData.message);
            done();
        });
    });

    describe("Fail request: with wrong password", function () {
        var responseData,
            promise,
            def,
            req;

        before(function (done) {
            req = {
                body: {
                    email: "test@signup.com",
                    password: "fake password"
                }
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.user.registerAndConfirmUser)
                .then(function () {
                    userController.signin(req, response, next);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    })
                });

        });
        it('Should exist error', function(done){
            assert.ok(responseData.message);
            assert.equal("Wrong login or password" ,responseData.message);
            done();
        });
    });

    describe("Fail request: with wrong email", function () {
        var responseData,
            promise,
            def,
            req;

        before(function (done) {
            req = {
                body: {
                    email: "fakeemail@signup.com",
                    password: "12345678"
                }
            };
            def = Q.defer();
            promise = def.promise;
            response.finish = def;
            helpers.db.user.clearUsers()
                .then(helpers.db.user.registerAndConfirmUser)
                .then(function () {
                    userController.signin(req, response, next);
                    promise.then(function (data) {
                        responseData = data;
                        done();
                    })
                });

        });

        it('Should exist error', function(done){
            assert.ok(responseData.message);
            assert.equal("Wrong login or password" ,responseData.message);
            done();
        });
    });

});

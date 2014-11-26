var config = require('config'),
    api = require('services/auth.service/api'),
    chai = require('chai'),
    async = require('async'),
    UserModel = require('common/resource/user.model'),
    logger = require('common/core/logs')(module),
    helpers = require('test/helpers');

describe('Auth service', function () {

    it("should exist api", function () {
        assert.isDefined(api);
    });

    describe("Sign up method", function () {

        it("should exist signup method", function () {
            assert.isDefined(api.signup);
        });

        it("should return email error", function (done) {
            api.signup('', '', function (err, user) {
                assert.isDefined(err);
                done();
            })
        });

        describe('Sign up with db', function () {

            var errData = null;
            var userData = null;
            var email = 'test@signup.com';
            var pass = '12345678';

            beforeEach(function (done) {
                helpers.db.user.clearUsers().then(function () {
                    api.signup(email, pass, function (err, user) {
                        errData = err;
                        userData = user;
                        done();
                    });
                }, function () {
                    logger.error("Cannot execute helpers.db.clearUsers");
                });
            });

            it("should not get error", function () {
                assert.notOk(errData);
            });

            it("should equal email", function () {
                assert.equal(email, userData.email);
            });

            it("should notEqual password", function () {
                assert.notEqual(pass, userData.password);
            });

            it("should status be 400", function () {
                assert.equal(400, userData.status);
            });

            it("should have confirmationId", function () {
                assert.ok(userData.confirmationId);
            });

        });

    });

    describe("ConfirmUser method", function () {
        it("should exist confirmUser method", function () {
            assert.isDefined(api.confirmUser);
        });

        it("should return error if doesn't have confirmationId", function (done) {
            api.confirmUser('', function (err) {
                assert.ok(err);
                done();
            });
        });

        describe("ConfirmUser using db", function () {
            var confirmationId = null;
            var email = "test@signup.com";
            var pass = "12345678";
            var userData = null;
            var errData = null;

            before(function (done) {
                helpers.db.user.clearUsers().then(function () {

                    async.waterfall([
                        //register user
                        function (cb) {
                            api.signup(email, pass, function (err, user) {
                                userData = user;
                                confirmationId = user.confirmationId;
                                cb();
                            });
                        },
                        //confirm user by token
                        function (cb) {
                            api.confirmUser(confirmationId, function (err) {
                                errData = err;
                                cb();
                            });
                        },
                        //get user
                        function (cb) {
                            UserModel.findById(userData._id, function (err, user) {
                                userData = user;
                                cb();
                            })
                        }
                    ], function () {
                        done();
                    });

                });
            });

            after(function (done) {
                helpers.db.user.clearUsers().then(function () {
                    done();
                })
            });

            it("user should not have confirmationId", function () {
                assert.notOk(userData.confirmationId);
            });

            it("user should have confirm_at", function () {
                assert.ok(userData.confirm_at);
            });

            it("user should have 200 status", function () {
                assert.equal(200, userData.status);
            });
        });

    });

    describe("Signin method", function () {

        it("should exist signin method", function () {
            assert.isDefined(api.signin);
        });
        
        describe("Signin with db", function () {

            describe("Right Signin", function () {
                var errData = null;
                var tokenData = null;

                before(function (done) {
                    var email = "test@signup.com";
                    var pass = "12345678";

                    helpers.db.user.clearUsers().then(function () {
                        helpers.db.user.registerAndConfirmUser({
                            email: email,
                            pass: pass
                        }).then(function (user) {
                            api.signin(email, pass, function (err ,token) {
                                errData = err;
                                tokenData = token;
                                done();
                            });
                        })
                    })
                });

                it("error should not exist", function () {
                    assert.notOk(errData);
                });

                it("token should exist", function () {
                    assert.ok(tokenData);
                });

                it("token token should exist", function () {
                    assert.ok(tokenData.token);
                });

                it("token token_to_update should exist", function () {
                    assert.ok(tokenData.token_to_update);
                });
            });

            describe("Wrong Signin", function () {
                var errData = null;
                var tokenData = null;

                before(function (done) {
                    var email = "test@signup.com";
                    var pass = "12345678";

                    helpers.db.user.clearUsers().then(function () {
                        helpers.db.user.registerAndConfirmUser({
                            email: email,
                            pass: 23323
                        }).then(function (user) {
                            api.signin(email, pass, function (err ,token) {
                                errData = err;
                                tokenData = token;
                                done();
                            });
                        })
                    })
                });

                it("error should exist", function () {
                    assert.ok(errData);
                });
            });

        })
    });
    
    describe("getUserByToken method", function () {

        it("should exist getUserByToken method", function () {
            assert.isDefined(api.getUserByToken);
        });

        describe("getUserByToken with db", function () {

            describe("getUserByToken right method", function () {
                var email = "test@signup.com";
                var pass = "12345678";
                var userData = null;

                before(function (done) {
                    helpers.db.user.clearUsers().then(function () {
                        helpers.db.user.registerConfirmSignin({
                            email: email,
                            pass: pass
                        }).then(function (data) {
                            api.getUserByToken(data.token.token, function (err ,user) {
                                userData = user;
                                done();
                            });
                        })
                    })
                });

                it('user should exist', function () {
                    assert.ok(userData);
                });

                it('user _id should exist', function () {
                    assert.ok(userData._id);
                });

            });

            describe("getUserByToken failed method", function () {
                var email = "test@signup.com";
                var pass = "12345678";
                var userData = null;
                var errData = null;

                before(function (done) {
                    helpers.db.user.clearUsers().then(function () {
                        helpers.db.user.registerConfirmSignin({
                            email: email,
                            pass: pass
                        }).then(function (token) {
                            api.getUserByToken('some wrong token', function (err ,user) {
                                errData = err;
                                userData = user;
                                done();
                            });
                        })
                    })
                });

                it('error should exist', function () {
                    assert.ok(errData);
                });

            });

        });
    })

});
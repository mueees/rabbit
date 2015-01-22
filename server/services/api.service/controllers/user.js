var Controller = require('common/core/controller/base'),
    _ = require('underscore'),
    logger = require('common/core/logs')(module),
    HttpError = require('../errors/HttpError').HttpError,
    Q = require('q'),
    async = require('async'),
    config = require('config'),
    UserModel = require('common/resource/user.model'),
    validator = require('validator'),
    kue = require('kue'),
    util = require('util');

var tasks = kue.createQueue();

_.extend(Controller.prototype, {
    signup: function (req, res, next) {
        var body = req.body;
        var errors = [];

        if( !validator.isEmail(body.email) ) {
            errors.push({
                message: 'signup: invalid email'
            });
        }

        if( !validator.isLength(body.password, 5) ){
            errors.push({
                message: "Password least than 3"
            });
        }

        if(errors.length){
            logger.error('Sign in error', {
                errors: errors
            });
            res.finish.resolve({message: "Sign error"});
            return next(new HttpError(400, {
                message: errors
            }));
        }

        async.waterfall([
            function(cb){
                UserModel.isHaveUser(body.email, cb);
            },
            function(isHaveUser, cb){
                if( isHaveUser ){
                    return cb("User with same email already registered");
                }else{
                    cb(null);
                }
            },
            function(cb){
                UserModel.registerNewUser(body.email, body.password, cb);
            }
        ], function(err, user){
            if(err){
                logger.error('Sign in error', {
                    error: err
                });
                res.finish.resolve(err);
                return next(new HttpError(400, err));
            }

            var data = {data: user};

            res.status(200);
            res.send({
                _id: user._id
            });

            //send email for notification

            /*
             * todo: need create task entity with default options:
             * Example: ConfirmationEmailTask.execute({
             *   to: body.email,
             *   data: {
             *       confirmationId: user.confirmationId
             *   }
             * });
             *
             * In this case User Controller doesn't need inject kue
             * We will have ConfirmationEmail in one place
             * Simple refactoring and reusing current task
             * Task have the similar interface
             * */

            tasks.create( config.get("queues:tasks:sendEmail"), {
                to: body.email,
                subject: "Confirm email",
                template: "/views/email/confirmEmail.jade",
                data: {
                    confirmationId: user.confirmationId
                }
            }).removeOnComplete(true).save(function (err) {
                if(err) {
                    logger.error(err);
                }
            });

            //for testing
            res.finish.resolve(data);
        });
    },

    confirmuser: function (req, res, next) {
        var confirmationId = req.query.confirmationId;
        if(!confirmationId){
            res.finish.resolve({message: "Cannot find confirmationId"});
            next(new HttpError(400, {
                message: 'Cannot find confirmationId'
            }));
        }

        async.waterfall([
            function (cb) {
                UserModel.isHaveConfirmationId(confirmationId, cb);
            },
            function (user, cb) {
                if(!user){
                    return cb("Doesn't have user with this confirmationId");
                }
                user.confirm(function (err) {
                    if(err){
                        return cb("Cannot confirm user");
                    }
                    cb();
                });
            }
        ], function (err) {
            if(err){
                logger.error('Confirm in error', {
                    error: err
                });
                res.finish.resolve({
                    message: err
                });
                return next(new HttpError(400, err));
            }
            res.redirect('/');

            //for testing
            res.finish.resolve();
        });
    },

    signin: function (req, res, next ) {
        var body = req.body;
        var email = body.email;
        var password = body.password;

        if(!email || !password){
            res.finish.resolve({message: "Wrong login or password"});
            return next(new HttpError(400, "Wrong login or password"));
        }

        async.waterfall([
            function (cb) {
                UserModel.isRightCredential(email, password, cb);
            },
            function (user, cb) {
                if(user.confirmationId){
                    return cb("Please confirm account. Check your email");
                }
                user.generateToken(cb);
            }
        ], function (err, token) {
            if(err){
                logger.error('Signin error', {
                    error: err
                });
                res.finish.resolve({
                    message: err
                });
                return next(new HttpError(400, err));
            }

            var data = {token: token};
            res.finish.resolve(data);
            res.status(200);
            res.send(data);
        });
    }
});

module.exports = new Controller();
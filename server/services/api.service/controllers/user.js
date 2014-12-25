var Controller = require('common/core/controller/base'),
    _ = require('underscore'),
    logger = require('common/core/logs')(module),
    HttpError = require('../errors/HttpError').HttpError,
    Q = require('q'),
    config = require('config'),
    kue = require('kue'),
    authService = require("../modules/authServiceRemote"),
    util = require('util');

var tasks = kue.createQueue();

_.extend(Controller.prototype, {
    signup: function (req, res, next) {
        var body = req.body;
        authService.execute('signup', body.email, body.password, function (err, user) {

            if(err){
                logger.error('Sign in error', err);
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
            * Task have the simmilar interface
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

        authService.execute('confirmUser', confirmationId, function (err) {
            if(err){
                logger.error('Sign in error', err);
                res.finish.resolve(err);
                return next(err);
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
            return next(new HttpError(400, {
                message: "Wrong login or password"
            }));
        }

        authService.execute('signin', email, password, function (err, token) {
            if(err){
                logger.error('signin error', err);
                res.finish.resolve(err);
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
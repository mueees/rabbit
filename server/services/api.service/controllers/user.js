var Controller = require('common/core/controller/base'),
    _ = require('underscore'),
    logger = require('common/core/logs')(module),
    HttpError = require('../errors/HttpError').HttpError,
    Q = require('q'),
    authService = require("../modules/authServiceRemote"),
    util = require('util');

_.extend(Controller.prototype, {
    signup: function (req, res, next, def) {
        var body = req.body;
        authService.execute('signup', body.email, body.password, function (err, user) {
            if(err){
                logger.error('Sign in error', err);
                def.resolve(err);
                return next(err);
            }

            var data = {data: user};
            res.status(200);
            res.send(data);

            //for testing
            def.resolve(data);
        });
    },
    confirmuser: function (req, res, next, def) {
        var confirmationId = req.query.confirmationId;
        if(!confirmationId){
            def.resolve({message: "Cannot find confirmationId"});
            next(new HttpError(400, {
                message: 'Cannot find confirmationId'
            }));
        }

        authService.execute('confirmUser', confirmationId, function (err) {
            if(err){
                logger.error('Sign in error', err);
                def.resolve(err);
                return next(err);
            }

            res.status(200);
            res.send({});

            //for testing
            def.resolve();
        });
    },
    signin: function (req, res, next, def   ) {
        var email = req.query.email;
        var password = req.query.password;

        if(!email || !password){
            def.resolve({message: "Wrong login or password"});
            return next(new HttpError(400, {
                message: "Wrong login or password"
            }));
        }

        authService.execute('signin', email, password, function (err, token) {
            if(err){
                logger.error('signin error', err);
                def.resolve(err);
                return next(err);
            }

            var data = {token: token};
            def.resolve(data);
            res.status(200);
            res.send(data);
        });
    }
});

module.exports = new Controller();
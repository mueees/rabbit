var validator = require('validator'),
    async = require('async'),
    logger = require('common/core/logs')(module),
    UserModel = require('common/resource/user.model'),
    util = require('util'),
    ServiceError = require('common/core/errors/service.error').ServiceError;

/*connect to mongo*/
require('common/mongooseDb');

var api = {
    /*
     * Register user
     * */
    signup: function (email, password, cb) {
        if( !validator.isEmail(email) ) {
            logger.error('signup: invalid email', {email: email});
            cb(new ServiceError(400, "Invalid Email"));
            return false;
        }

        if( !validator.isLength(password, 5) ){
            return cb(new ServiceError(400, "Password least than 3"));
        }

        async.waterfall([
            function(cb){
                UserModel.isHaveUser(email, cb);
            },
            function(isHaveUser, cb){
                if( isHaveUser ){
                    return cb("User with same email already registered");
                }else{
                    cb(null);
                }
            },
            function(cb){
                UserModel.registerNewUser(email, password, cb);
            }
        ], function(err, user){
            if( err ){
                return cb(new ServiceError(400, err));
            }

            cb(null, user);
        })
    },

    /*
     * Confirm email user, using token
     * */
    confirmUser: function (confirmationId, cb) {
        if(!confirmationId){
            logger.error('confirmUser: no token', {token: confirmationId});
            cb(new ServiceError(400, "No Token"));
            return false;
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
        ], function (err, user) {
            if(err){
                return cb(new ServiceError(400, err));
            }
            cb();
        });
    },

    /*
     * Login User using email and pass
     * */
    signin: function (email, pass, cb) {
        async.waterfall([
            function (cb) {
                UserModel.isRightCredential(email, pass, cb);
            },
            function (user, cb) {
                if(user.confirmationId){
                    return cb("Please confirm account. Check your email");
                }
                user.generateToken(cb);
            }
        ], function (err, token) {
            if(err){
                logger.error(err);
                return cb(new ServiceError(400, err));
            }
            cb(null, token);
        });

     },

    /*
     * Logout user, delete his token
     * */
    logout: function () {

    },

    /*
     * Get user information by token
     * */
    getUserByToken: function (token, cb) {

        if(!token){
            logger.error("Cannot find token");
            return cb(new ServiceError(400, "Cannot find token"));
        }

        UserModel.getUserByToken(token, function (err, user) {
            if(err){
                logger.error("Cannot find user", err);
                return cb(new ServiceError(400, err));
            }

            if(!user){
                logger.error("Cannot find user");
                return cb(new ServiceError(400, "Cannot find user"));
            }

            cb(null, user);
        })
    }
};
module.exports = api;
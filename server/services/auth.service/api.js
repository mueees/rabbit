var validator = require('validator'),
    async = require('async'),
    logger = require('common/core/logs')(module),
    UserModel = require('common/resource/user.model'),
    ServiceError = require('common/core/errors/service.error').ServiceError;
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

        if( !validator.isLength(data.password, 5) ){
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
                return cb(new ServiceError(400, "Cannot register user"));
            }

            cb(null, user);
        })
    },

    /*
    * Confirm email user, using token
    * */
    confirmUser: function (token) {
        
    },

    /*
     * Login User using email and pass
     * */
    signin: function (email, pass, cb) {

    },

    /*
    * Logout user, delete his token
    * */
    logout: function () {

    },

    /*
    * Get user information by token
    * */
    getUserByToken: function (token) {

    }
};
module.exports = api;
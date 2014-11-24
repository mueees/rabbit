var passport = require('passport')
    , async = require('async')
    , HttpError = require('error').HttpError
    , UserModel = require('models/user')
    , LocalStrategy = require('passport-local').Strategy
    , logger = require('libs/log')(module)
    , config = require("config");

passport.serializeUser(function(id, done) {
    done(null, id);
});

passport.deserializeUser(function(id, done) {
    UserModel.findById(id, function(err, user){
        done(err, user);
    })
});

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */

passport.use(new LocalStrategy(
    { usernameField: 'email'},
    function(email, password, done) {
        async.waterfall([
            function(cb){
                UserModel.isHaveUser(email, cb);
            }, function(user, cb){
                if( !user ){
                    logger.info('Unknown email address');
                    return cb('Unknown email address');
                }
                if(!UserModel.comparePassword(password, user)){
                    logger.info('Invalid Password', {user: user});
                    return cb('Invalid Password');
                }
                switch(user.status){
                    case 200:
                        return cb(null, user);
                        break;
                    case 400:
                        logger.info('User not confirmed. Please check email', {user: user});
                        return cb("User not confirmed. Please check email");
                        break;
                }

            }
        ], function(err, user){
            if(err) return done(new HttpError(401, err));
            return done(null, user._id);
        })
    }
));
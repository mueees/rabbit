var mongoose = require('mongoose'),
    crypto = require('crypto'),
    async = require('async'),
    logger = require('common/core/logs')(module);

var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

var tokenSchema = new Schema({
    token: {
        type: "String",
        required: true
    },
    token_to_update: {
        type: "String",
        required: true
    },
    date_create: {
        type: 'Date',
        default: new Date()
    },
    date_expired: {
        type: 'Date',
        required: true
    }
});

var userSchema = new Schema({
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    confirmationId: {
        type: String,
        default: ""
    },

    date_create: {
        type: Date,
        default: new Date
    },

    confirm_at: {
        type: Date,
        default: null
    },

    tokens: {
        type: [tokenSchema],
        default: []
    },

    //200 - active
    //403 - blocking
    //400 - not confirmed
    status: {
        type: Number,
        default: 400,
        required: true
    }
});

userSchema.statics.isHaveConfirmationId = function(confirmationId, cb){
    this.find({confirmationId: confirmationId}, null, function(err, users){
        if( err ){
            logger.error(err);
            cb("Server error");
            return false;
        }

        if( users.length === 0 ){
            cb(null, false);
        }else{
            cb(null, users[0]);
        }
    });
};

userSchema.statics.getUniqCode = function(){
    var random = Math.random() * Math.random() * Math.random();
    return Math.floor((new Date()).getTime() * random) + "";
};

userSchema.statics.isHaveUser = function(email, cb){
    this.find({email: email}, null, function(err, users){
        if( err ){
            logger.error(err);
            return cb("Server error");
        }

        if( users.length === 0 ){
            cb(null, false);
        }else{
            cb(null, users[0]);
        }
    });
};

userSchema.statics.getUserByToken = function(token, cb){
    logger.info("get request getUserByToken " + token);
    this.find({
        tokens: {
            $all: [
                {
                    "$elemMatch" : {
                        token: token
                    }
                }
            ]
        }
    }, null, function(err, users){

        logger.info("getUserByToken");

        if( err ){
            logger.error(err);
            return cb("Server error");
        }

        if(!users){
            cb(null, false);
        }else if( users.length === 0 ){
            cb(null, false);
        }else{
            cb(null, users[0]);
        }
    });
};

userSchema.statics.isRightCredential = function (email, password, cb) {
    async.waterfall([
        function (cb) {
            User.isHaveUser(email, cb);
        },
        function (user, cb) {
            if(!user){
                return cb("Wrong login or password");
            }
            if(User.comparePassword(password, user.password, user.email)){
                cb(null, user);
            }else{
                cb("Wrong login or password");
            }
        }
    ], function (err, user) {
        if(err){
            return cb(err)
        }
        cb(null, user);
    });
};

userSchema.statics.comparePassword = function(password, userPassword, userEmail){
    var sha1 = crypto.createHash('sha1');
    sha1.update(password + userEmail + password);
    var password = sha1.digest('hex');

    return (password == userPassword) ? true : false;
};

userSchema.statics.registerNewUser = function(email, password, cb){

    var sha1 = crypto.createHash('sha1');
    sha1.update(password + email + password);
    password = sha1.digest('hex');

    var UserModel = mongoose.model('users');
    var user = new UserModel({
        email: email,
        password: password,
        confirmationId: this.getUniqCode()
    });

    //save user
    user.save(function(err){
        if(err){
            logger.error(err);
            return cb("Server error");
        }
        cb(null, user);
    });
};

userSchema.methods.confirm = function(cb){
    this.update({
        confirmationId: null,
        confirm_at: new Date(),
        status: 200
    }, function(err, user){
        if(err){
            logger.error(err);
            if(cb) return cb(err);
        }
        if(cb) cb(null, user);
    })
};

userSchema.methods.generateToken = function (cb) {
    var token = this._generateToken();
    this.tokens.push(token);
    this.save(function (err, user) {
        if(err){
            logger.error("Cannot save token", err);
            return cb("Cannot save token");
        }
        cb(null, token);
    })
};

userSchema.methods._generateToken = function (cb) {
    var date = new Date();
    var date_expired = new Date( date.setDate(date.getDate() + 31) );
    return {
        token: User.getUniqCode(),
        token_to_update: User.getUniqCode(),
        date_expired: date_expired
    };

};

var User = mongoose.model('users', userSchema);

module.exports = User;
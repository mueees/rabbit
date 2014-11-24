var mongoose = require('mongoose'),
    crypto = require('crypto'),
    logger = require('common/core/logs')(module);

var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

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
        default: "",
        required: true
    },

    date_create: {
        type: Date,
        default: new Date
    },

    confirm_at: {
        type: Date,
        default: null
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

userSchema.statics.getConfirmationId = function(){
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

userSchema.statics.comparePassword = function(password, user){
    var sha1 = crypto.createHash('sha1');
    sha1.update(password + user.email + password);
    var password = sha1.digest('hex');

    return (password == user.password) ? true : false;
};

userSchema.statics.registerNewUser = function(email, password, cb){

    var sha1 = crypto.createHash('sha1');
    sha1.update(password + email + password);
    password = sha1.digest('hex');

    var UserModel = mongoose.model('User');
    var user = new UserModel({
        email: email,
        password: password,
        confirmationId: this.getConfirmationId()
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
        status: 200
    }, function(err, user){
        if(err){
            logger.error(err);
            if(cb) return cb(err);
        }
        if(cb) cb(null, user);
    })
};

var User = mongoose.model('users', userSchema);

module.exports = User;
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    async = require('async'),
    _ = require('underscore'),
    categorySchema = require('./category.schema'),
    tokenSchema = require('./token.schema'),
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
    },

    categories: {
        type: [categorySchema],
        default: []
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

userSchema.statics.addCategory = function (userId, name, cb) {
    this.findById(userId, function (err, user) {
        if(err){
            logger.error(err);
            return cb(err);
        }
        if(!user){
            logger.error("Cannot find user, with userId " + userId);
            return cb("Cannot find user, with userId " + userId);
        }

        var category = user.categories.create({
            name: name
        });
        user.categories.push(category);

        user.save(function (err, user) {
            if(err){
                logger.error(err);
                return cb(err);
            }

            cb(null, user, category);
        });
    });
};

userSchema.statics.editCategory = function (userId, name, categoryId, cb) {
    this.findById(userId, function (err, user) {
        if(err){
            logger.error(err);
            return cb(err);
        }
        if(!user){
            logger.error("Cannot find user, with userId " + userId);
            return cb("Cannot find user, with userId " + userId);
        }

        var category = user.categories.id(categoryId);
        if(!category){
            return cb("Cannot find category with id: " + categoryId);
        }
        category.name = name;
        user.save(function (err, user) {
            if(err){
                logger.error(err);
                return cb(err);
            }

            cb(null, user, category);
        });
    })
};

userSchema.statics.isExistCategory = function (userId, categoryId, cb) {
    this.findById(userId, function (err, user) {
        if(err){
            return cb("Cannot find user by id");
        }

        var category = user.categories.id(categoryId);
        if(!category){
            return cb("Cannot find category by id");
        }
        cb(null, category, user);
    })
};

userSchema.statics.removeCategory = function (userId, categoryId, cb) {
    this.findById(userId, function (err, user) {
        if(err){
            logger.error(err);
            return cb(err);
        }
        if(!user){
            logger.error("Cannot find user, with userId " + userId);
            return cb("Cannot find user, with userId " + userId);
        }

        if(!user.categories.id(categoryId)){
            logger.error("Cannot find category");
            return cb("Cannot find category");
        }

        user.categories.id(categoryId).remove();

        user.save(function (err, user) {
            if(err){
                logger.error(err);
                return cb(err);
            }

            cb(null);
        });
    })
};

userSchema.statics.editName = function (userId, newName, feedId, cb) {
    this.findById(userId, function (err, user) {
        if(err){
            logger.error(err);
            return cb(err);
        }
        if(!user){
            logger.error("Cannot find user, with userId " + userId);
            return cb("Cannot find user, with userId " + userId);
        }

        user.categories.forEach(function (category) {
            var isHaveFeed = false;
            var index = null;
            category.feeds.forEach(function (feed) {
                if(String(feed.feedId) == String(feedId)){
                    feed.name = newName;
                    isHaveFeed = true;
                    return false;
                }
            });

            if(!isHaveFeed) {
                logger.error("Cannot find feed for editing");
                return cb("Cannot find feed for editing");
            }

            user.save(function (err, user) {
                if(err){
                    logger.error(err.message);
                    return cb(err);
                }
                cb(null);
            });
        });
    })
};

userSchema.statics.removeFeed = function (userId, feedId, cb) {
    this.findById(userId, function (err, user) {
        if(err){
            logger.error(err);
            return cb(err);
        }
        if(!user){
            logger.error("Cannot find user, with userId " + userId);
            return cb("Cannot find user, with userId " + userId);
        }

        user.categories.forEach(function (category) {
            var isHaveFeed = false;
            var index = null;
            category.feeds.forEach(function (feed, i) {
                if(String(feed.feedId) == String(feedId)){
                    isHaveFeed = true;
                    index = i;
                    return false;
                }
            });
            if(isHaveFeed) category.feeds.splice(index, 1);
        });

        user.save(function (err, user) {
            if(err){
                logger.error(err);
                return cb(err);
            }

            cb(null);
        });
    })
};

userSchema.statics.changeCategoryForFeed = function (userId, categoryId, feedId, cb) {
    var UserModel = mongoose.model('users');

    UserModel.isExistCategory(userId, categoryId, function (err, category, user) {
        if(err){
            logger.error(err.message);
            return cb(err);
        }

        /*feed that change category*/
        var feed;

        user.categories.forEach(function (category) {
            var isHaveFeed = false;
            var index = null;
            category.feeds.forEach(function (feed, i) {
                if(String(feed.feedId) == String(feedId)){
                    isHaveFeed = true;
                    index = i;
                    return false;
                }
            });
            if(isHaveFeed) {
                var addFeed = category.feeds.splice(index, 1);
                if(addFeed.length){
                    feed = addFeed[0];
                }
            }
        });

        /* we cannot find feed */
        if(!feed) {
            logger.error("Cannot find feedId, when changing category for this feed.");
            return cb("Cannot find feedId, when changing category for this feed.");
        }
        user.categories.id(category._id).feeds.push(feed);

        user.save(function (err) {
            if(err){
                logger.error(err.message);
                return cb("Cannot save feed");
            }
            cb();
        })

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
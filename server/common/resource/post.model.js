var mongoose = require('mongoose'),
    _ = require('underscore'),
    logger = require('common/core/logs')(module);

var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

var ObjectIdFromType = mongoose.Types.ObjectId;

var userDataSchema = new Schema({

    /*
     * User id
     * */
    userId: {
        type: ObjectId,
        required: true
    },

    /*
     * Does user read this post ?
     * */
    isRead: {
        type: Boolean,
        default: false
    },

    /*
     * Mark as read later
     * */
    readLater: {
        type: Boolean,
        default: false
    },

    /*
     * All user can have the list of tags
     * */
    tags: {
        type: [ObjectId],
        default: []
    }
});

var postSchema = new Schema({

    /*
     * Title post
     * */
    title: {
        type: String,
        default: ''
    },

    /*
     * Full post ( body )
     * */
    body: {
        type: String,
        default: ''
    },

    /*
     * Link to post
     * */
    link: {
        type: String,
        required: true,
        unique: true
    },

    /*
     * Unique guid for post
     * */
    guid: {
        type: String,
        required: true,
        unique: true
    },

    /*
     * Url to main image for post
     * */
    image: {
        type: String,
        default: ''
    },

    /*
     * Date, when post was published
     * */
    pubdate: {
        type: Date,
        default: new Date()
    },

    source: {
        type: String,
        default: ''
    },

    /*
     * Feed id
     * */
    feedId: {
        type: ObjectId,
        required: true
    },

    dateCreate: {
        type: Date,
        default: new Date()
    },

    users: {
        type: [userDataSchema],
        default: []
    }
});

postSchema.statics.readUnread = function(userId, postId, state, cb){
    this.findById(postId, function (err, post) {
        if(err){
            logger.error(err.message);
            return cb("Cannot find post");
        }

        var userArr = _.find(post.users, function (userData) {
            if(String(userData.userId) == userId){
                return userData;
            }
        });

        if(!userArr || !userArr.length){
            /* post doesn't have specific user information yet */
            post.users.push({
                userId: userId,
                isRead: state
            })
        }else{
            var userData = userArr[0];
            userData.isRead = state;
        }

        console.log(userData);
        console.log(post.users);

        post.save(function (err, post) {
            if(err){
                logger.error(err.message);
                return cb("Cannot save post");
            }
            cb();
        });
    })
};


postSchema.statics.checkUncheck = function(userId, postId, state, cb){
    this.findById(postId, function (err, post) {
        if(err){
            logger.error(err.message);
            return cb("Cannot find post");
        }

        var userArr = _.find(post.users, function (userData) {
            if(String(userData.userId) == userId){
                return userData;
            }
        });

        if(!userArr || !userArr.length){
            /* post doesn't have specific user information yet */
            post.users.push({
                userId: userId,
                readLater: state
            })
        }else{
            var userData = userArr[0];
            userData.readLater = state;
        }

        post.save(function (err, post) {
            if(err){
                logger.error(err.message);
                return cb("Cannot save post");
            }
            cb();
        });
    })
};

postSchema.statics.getPosts = function(options, cb){

    /*todo: we should return associated user data with post information*/
    if( options.user ){
        this.aggregate([
            {
                $match: {
                    feedId: new ObjectIdFromType(options.source.params._id)
                }
            },
            {
                $sort: {
                    pubdate: -1
                }
            },
            {
                $skip: options.from
            },
            {
                $limit: options.count
            },
            {
                $project : {
                    "users" : {
                        $cond : [ { $eq : [ "$users", [] ] }, [ {
                            isRead: false,
                            readLater: false,
                            tags: [],
                            userId: options.user._id
                        } ], '$users' ]
                    },
                    title: 1,
                    body: 1,
                    image: 1,
                    link: 1,
                    feedId: 1,
                    pubdate: 1
                }
            },
            {
                $unwind : "$users"
            },
            {
                $match: {
                    $or :[
                        {
                            "users.userId" :new ObjectIdFromType(options.user._id)
                        },
                        {
                            "users.userId" : options.user._id
                        }
                    ]
                }
            }
        ], function (err, posts) {
            if(err){
                logger.error(err.message);
                return cb("Cannot find posts");
            }
            cb(err, posts);
        });
    }else{

        var query = {};

        if( options.source.name == "feed" ){
            query.feedId = options.source.params._id;
        }

        this.find(query, {
            users: false,
            __v: false
        }, {
            skip: options.from,
            limit: options.count,
            sort: {
                pubdate: -1 //Sort by Date Added DESC
            }
        }, function (err, posts) {
            if(err){
                logger.error(err.message);
                return cb("Cannot find posts");
            }
            cb(err, posts);
        });
    }

};

var Post = mongoose.model('posts', postSchema);

module.exports = Post;
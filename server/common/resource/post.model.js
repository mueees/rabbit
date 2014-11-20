var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

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
        required: true
    },

    /*
    * Unique guid for post
    * */
    guid: {
        type: String,
        required: true
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
        type: Date
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

var Post = mongoose.model('posts', postSchema);

module.exports = Post;
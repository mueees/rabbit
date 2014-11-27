var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

var feedSchema = new Schema({

    feedId: {
        type: ObjectId,
        required: true
    },
    /*
     * Count of unread posts for current user
     * */
    unreadPosts: {
        type: "Number",
        default: 0
    },

    /*
     * Name feed for current user
     * */
    name: {
        type: "String",
        default: ""
    },

    date_added: {
        type: "Date",
        default: new Date()
    }

});

var categorySchema = new Schema({

    /*
     * Name category
     * */
    name: {
        type: String,
        require: true
    },

    date_create: {
        type: "Date",
        default: new Date()
    },

    feeds: {
        type: [feedSchema],
        default: []
    }

});

module.exports = categorySchema;
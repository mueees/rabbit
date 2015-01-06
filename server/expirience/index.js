var validator = require('validator'),
    async = require('async'),
    logger = require('common/core/logs')(module),
    FeedModel = require('common/resource/feed.model'),
    PostModel = require('common/resource/post.model'),
    util = require('util'),
    _ = require('underscore'),
    url = require('url'),
    Q = require('q'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ObjectId1 = require('mongoose').Types.ObjectId;

//link database
require("common/mongooseDb");

/*
PostModel.aggregate([
    {
        '$match': {
            'feedId': new ObjectId1("54aa89409e7041a50cb1bac9")
        }
    },
    {
        $sort: {
            pubdate: -1
        }
    },
    {
        $project : {
            "users" : {
                $cond : [ { $eq : [ "$users", [] ] }, [ null ], '$users' ]
            },
            title: 1,
            body: 1,
            image: 1,
            source: 1,
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
                    "users.userId" :new ObjectId1("54aa89409e7041a50cb1bac0")
                },
                {
                    "users" : null
                }
            ]
        }
    }
], function (err, posts) {
    if(err){
        console.log(err);
        process.exit();
    }

    console.log(posts);

    process.exit();
});*/

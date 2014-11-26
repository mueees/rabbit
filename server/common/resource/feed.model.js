var mongoose = require('mongoose'),
    FeedParser = require('feedparser'),
    Q = require('q'),
    logger = require('common/core/logs')(module),
    PostModel = require('common/resource/post.model'),
    request = require('request');

var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;



var feedSchema = new Schema({

    /*
     * Default feed name
     * */
    name: {
        type: String,
        required: true
    },

    /*
     * Feed url
     * */
    url: {
        type: String,
        required: true
    },

    /*
     * Path to icon for feed
     * */
    ico: {
        type: String,
        default: ''
    },

    /*
     * Some meta
     * */
    meta: {

        /*
         * Count posts for this feed
         * */
        postsCount: {
            type: Number,
            default: 0
        },

        /*
         * Date, when this feed was created
         * */
        date_create: {
            type: Date,
            default: new Date()
        },

        /*
         * Rss has collections topics.
         * Each feed can have several topics.
         * This is need for future, each user could find interesting feed with same topic
         * */
        topics: {
            type: [ObjectId],
            default: []
        }
    }
});

feedSchema.statics.getPostsFromUrl = function(options){
    var posts = [];
    var def = Q.defer();

    logger.debug('Fetching posts by url');
    request( {
        url: options.url,
        timeout: options.timeout || 20000
    } )
        .on('error', function (error) {
            var err = {
                message: "Cannot make request",
                data: {
                    url: options.url
                }
            };
            logger.error(err.message, err.data);
            def.reject(err);
        })
        .pipe(new FeedParser())
        .on('error', function (error) {
            var err = {
                message: "Not a feed",
                data: {
                    url: options.url
                }
            };
            logger.error(err.message, err.data);
            def.reject(err);
        })
        .on('readable', function() {
            var post;
            var stream = this;
            while (post = stream.read()) {
                posts.push({
                    title: post.title || "",
                    body: post.summary || "",
                    link: post.link || "",
                    pubdate: new Date(post.pubdate) || "",
                    guid: post.guid || "",
                    image: post.image || "",
                    source: post.source || "",
                    feedId: options.feedId
                });
            }
        })
        .on('end', function() {
            def.resolve(posts);
        });

    return def.promise;
};
feedSchema.statics.getLastPost = function(feedId){
    var def = Q.defer();
    PostModel.findOne({
        feedId: feedId
    }, {}, { sort: { 'pubdate' : -1 } }, function(error, lastPost) {
        if(error){
            logger.error(error);
            def.reject(error);
            return false;
        }
        def.resolve(lastPost);
    });
    return def.promise;
};

var Feed = mongoose.model('feeds', feedSchema);

module.exports = Feed;

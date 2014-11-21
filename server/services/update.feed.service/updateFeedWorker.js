var request = require('request'),
    Q = require('q'),
    kue = require('kue'),
    logger = require('common/core/logs')(module),
    config = require('config'),
    FeedModel = require('common/resource/feed.model'),
    tasks = kue.createQueue(),
    FeedParser = require('feedparser');

function worker(feed, done){
    var data = feed.data;
    if( !data ) {
        logger.error('Cannot find feed information');
        return done();
    }

    logger.info('Start work');
    Q.all([
        FeedModel.getPostsFromUrl(data.url, data._id),
        FeedModel.getLastPost(data._id)
    ]).then(function (results) {
        var posts = results[0];
        var lastPost = results[1];
        return filterPosts(posts, lastPost);
    }).then(function (posts) {
        return makeTask(posts);
    }).then(function (prepareRowPostTasks) {
        return saveTasks(prepareRowPostTasks);
    }).then(function () {
        done();
    })
}

function filterPosts(posts, lastPost) {
    var result = [];
    if( lastPost ){
        var lastDate = new Date(lastPost.pubdate);
        posts.forEach(function (post) {
            var postDate = new Date(post.pubdate);
            if( postDate >= lastDate ) result.push(post);
        })
    }else{
        result = posts;
    }
    return posts;
}
function makeTask(posts) {
    var result = [];
    posts.forEach(function (post) {
        result.push(tasks.create(config.get("queues:tasks:prepareRowPost"), post));
    });
    return result;
}
function saveTasks(prepareRowPostTasks) {
    var promises = prepareRowPostTasks.map(function (task) {
        var def = Q.defer();
        task.save(function (err) {
            if(err){
                logger.error(err);
                def.reject(err);
                return false;
            }

            def.resolve();
        });
        return def.promise;
    });
    return Q.all(promises).then(function () {
        logger.debug(prepareRowPostTasks.length + " task was saved.");
    });
}
module.exports = worker;
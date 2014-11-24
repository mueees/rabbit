var request = require('request'),
    Q = require('q'),
    kue = require('kue'),
    logger = require('common/core/logs')(module),
    config = require('config'),
    configService = require('./config'),
    FeedModel = require('common/resource/feed.model'),
    tasks = kue.createQueue();

function Worker(task, done) {
    this.task = task;
    this.data = task.data;
    this.done = done;

    this.interval = null;
}

Worker.prototype.filterPosts = function (posts, lastPost) {
    var result = [];

    if( lastPost ){
        var lastDate = new Date(lastPost.pubdate);
        posts.forEach(function (post) {
            var postDate = new Date(post.pubdate);
            if( postDate > lastDate ){
                result.push(post);
            }
        })
    }else{
        result = posts;
    }

    logger.info('Count posts to save ' +  result.length);

    return result;
};

Worker.prototype.makeTask = function (posts) {
    var result = [];
    posts.forEach(function (post) {
        result.push(tasks.create(config.get("queues:tasks:prepareRowPost"), post).removeOnComplete(true));
    });
    return result;
};

Worker.prototype.saveTasks = function (prepareRowPostTasks) {
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
};

Worker.prototype.execute = function () {
    var _this = this;

    if( !this.data ) {
        logger.error('Cannot find feed information');
        _this.done('Cannot find feed information');
        return false;
    }

    Q.all([
        FeedModel.getPostsFromUrl({
            url: _this.data.url,
            timeout: configService.executeTime,
            feedId: _this.data._id
        }),
        FeedModel.getLastPost(_this.data._id)
    ]).then(function (results) {
        var posts = results[0];
        var lastPost = results[1];
        var postToSave = _this.filterPosts(posts, lastPost);
        postToSave = _this.makeTask(postToSave);

        _this.saveTasks(postToSave).then(function () {
            _this.done();
        }, function () {
            _this.done("Cannot save task");
        });

    }, function (err) {
        logger.error(err.message, err.data);
        _this.done("Error when fetch");
    });
};

module.exports = Worker;
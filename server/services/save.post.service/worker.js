var request = require('request'),
    Q = require('q'),
    logger = require('common/core/logs')(module),
    configService = require('./config'),
    PostModel = require('common/resource/post.model'),
    config = require('config');

var tasksContainer = [];
var interval = startTimer();
function startTimer(){
    return setInterval(function () {
        if( !tasksContainer.length ) return false;
        logger.info("Timer execute");
        stopTimer();
        savePost().then(function () {
            interval = startTimer();
            logger.info("Timer starting");
        });
    }, configService.delayTime);
}
function stopTimer(){
    if(interval) clearInterval(interval);
}

function savePost(){
    var posts = tasksContainer.splice(0, configService.countForSave);
    return PostModel.create(posts).then(function () {
        logger.info(posts.length + ' was saved');
    });
}
function worker(task, done) {
    tasksContainer.push(task.data);
    if( tasksContainer.length >= configService.countForSave ){
        stopTimer();
        savePost().then(function () {
            interval = startTimer();
        });
    }
    done();
}
module.exports = worker;
/*
 * Role of this service
 * Collect tasks
 * 1. countForSave or
 * 2. delayTime
 * and then save
 * */

 var config = require('config'),
    configService = require('./config'),
    logger = require('common/core/logs')(module),
    PostModel = require('common/resource/post.model'),
    kue = require('kue');
var tasks = kue.createQueue();

//init connection to mongo database
require('common/mongooseDb');


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
tasks.process(config.get("queues:tasks:savePost"), configService.workerCount, function (task, done, ctx) {
    tasksContainer.push(task.data);
    if( tasksContainer.length >= configService.countForSave ){
        stopTimer();
        savePost().then(function () {
            interval = startTimer();
        });
    }
    done();
});
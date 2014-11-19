var kue = require('kue');
var  jobs = kue.createQueue();
var  tasks = kue.createQueue();

jobs.process('jobs', 1, function(job, done){
    console.log("process jobs");
    done();
});

/*
tasks.process('tasks', 1, function(job, done){
    console.log("process tasks");
    done();
});*/

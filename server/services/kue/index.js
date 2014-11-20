var kue = require('kue');
var jobs = kue.createQueue();

var tasks = kue.createQueue();

for(var i = 0; i < 10; i++){
    jobs.create('updateFeed', {
        title: 'JOBS'
    }).save(function (err) {
        if(!err){
            console.log('jobs added');
        }
    });
}
var Service = require('./service/service');
var cluster = require('cluster');
var clusterWorkerSize = require('os').cpus().length;

if (cluster.isMaster) {
    console.log('I am father');
    for (var i = 0; i < clusterWorkerSize; i++) {
        cluster.fork();
    }
} else {
    new Service();
    console.log('I am fork');
}
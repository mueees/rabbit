var redis = require('redis');
var config = require('config')
var client = redis.createClient();

/*client.on('ready', function () {
    console.log('ready');
});*/

client.on('connect', function () {
    console.log('connect');
});


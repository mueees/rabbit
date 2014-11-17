var amqp       = require('amqp');

var connection = amqp.createConnection({host: 'localhost'});

var message = process.argv.slice(2).join(' ') || 'Hello World!';

connection.on('ready', function(){
    connection.queue('task_queue', {autoDelete: false,
        durable: true}, function(queue){
        for(var i = 0; i < 100000; i++){
            connection.publish('task_queue', message, {deliveryMode: 2});
            console.log(" [x] Sent %s", message);
        }

    });
});
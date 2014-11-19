var amqp       = require('amqp');

var connection = amqp.createConnection({host: 'localhost'});

var message = process.argv.slice(2).join(' ') || 'Hello asdWor2ld!';

connection.on('ready', function(){
    for(var i = 0; i < 1000; i++){
        connection.publish('hello', message, {deliveryMode: 1});
    }

    console.log(" [x] Sent %s", message);
});

var amqp = require('amqp');
var connection = amqp.createConnection({host: 'localhost'});
connection.on('ready', function(){
    connection.publish('hello', 'Hello World!');
    console.log(" [x] Sent 'Hello World!'");
});
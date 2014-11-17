var amqp = require('amqp');
var connection = amqp.createConnection({host: 'localhost'});
connection.on('ready', function(){
    for(var i = 0; i < 1000; i++){
        connection.publish('hello', 'Hello World!');
    }
    console.log(" [x] Sent 'Hello World!'");
});
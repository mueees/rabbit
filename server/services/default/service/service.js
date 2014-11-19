var config = require('../config/config'),
    amqp = require('amqp'),
    Q = require('Q');

function Service(){

    //connection to rabbitmq server
    this._rabbitMqConn = null;
    //list of queues
    this._queues = {};

    this.init();
}

Service.prototype.init = function () {
    //connection to rabbitMq
    var _this = this;
    this._initRabbitMqConn().then(function () {
        console.log("Establish connect to RabbitMq");
        _this._initQueuesConn().then(function () {
            console.log("Start Subscribe");
            _this._setSubscribes();
        });
    });

    /*
     * connection to the queueu
     * OPTIONS:
     * - durable - очередь сохраняется при перезагрузке сервера
     * - autoDelete - удалит очередь при
     * */
    /*this._rabbitMqConn.queue('testQueue', {
     durable: true,
     autoDelete: false
     }, function (q) {

     //queue.subscribe([options,] listener)
     q.subscribe({
     ack: true,
     prefetchCount: 1
     }, function (message, headers, deliveryInfo, ack) {

     });
     });*/

    /*this.initRabbitMqConn()
     .then(function () {
     console.log('done');
     }, function () {
     console.log('reject');
     });*/
};

//connect ot RabbitMq
Service.prototype._initRabbitMqConn = function () {
    var deferred = Q.defer();
    if(!config.rabbitMqConn) throw new Error("No rabbitMqConn settings");
    this._rabbitMqConn = amqp.createConnection(config.rabbitMqConn);
    this._rabbitMqConn.on('ready', function () {
        deferred.resolve();
    });
    return deferred.promise;
};
Service.prototype._initQueuesConn = function () {
    var _this = this;
    var deferred = Q.defer();
    config.rabbit.queues.forEach(function (queueu) {
        _this._getQueue(queueu);
        setTimeout(function () {
            deferred.resolve();
        },  300)
    });
    return deferred.promise;
};
Service.prototype._getQueue = function (queueu) {
    var _this = this;
    this._rabbitMqConn.queue(queueu.name, queueu.options, function (q) {
        if(_this._queues[queueu.name]) return false;
        console.log("Establish connection with " + queueu.name + " queueu");
        _this._queues[queueu.name] = q;
    });
};
Service.prototype._setSubscribes = function () {
    var _this = this;
    config.rabbit.queues.forEach(function (queueu) {
        queueu.subscribes.forEach(function (subscribe) {
            _this._setSubscribe(queueu.name, subscribe);
        });
    });
};
Service.prototype._setSubscribe = function (queueName, subscribe) {
    var _this = this;
    if(!this._queues[queueName]) throw new Error("Cannot find q");
    console.log("Subscribe to "+ queueName);
    this._queues[queueName].subscribe(subscribe.options,  _this[subscribe.method]);
};
Service.prototype.helloHandler = function (message, headers, deliveryInfo, queue) {
    var body = message.data.toString('utf-8');
    console.log("habdler1")
};

module.exports = Service;
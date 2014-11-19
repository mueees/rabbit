module.exports = {
    rabbitMqConn: {
        host: 'localhost'
    },
    rabbit: {
        host: 'localhost',
        queues:[
            {
                name: "hello",
                options: {
                    durable: true,
                    autoDelete: false
                },
                subscribes: [
                    {
                        options: {
                            ack: false,
                            prefetchCount: 1
                        },
                        method: "helloHandler"
                    }
                ]
            }
        ]


    }
};
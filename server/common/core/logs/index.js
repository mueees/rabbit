var winston = require('winston');
var path = require('path');
var ENV = process.env.NODE_ENV;

function getLogger( module ){
    var pathModule = module.filename.split("/").slice(-2).join('/');
    var level = ENV == "development" ? "debug" : "error";

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level:  level,
                label: pathModule
            }),
            new winston.transports.File({
                filename: '../../logs/logs.log',
                level: "error",
                label: pathModule
            })
        ]
    });
}

module.exports = getLogger;

/*
*
 logger.log('silly', "127.0.0.1 - there's no place like home");
 logger.log('debug', "127.0.0.1 - there's no place like home");
 logger.log('verbose', "127.0.0.1 - there's no place like home");
 logger.log('info', "127.0.0.1 - there's no place like home");
 logger.log('warn', "127.0.0.1 - there's no place like home");
 logger.log('error', "127.0.0.1 - there's no place like home");


* */
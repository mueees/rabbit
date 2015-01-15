var winston = require('winston');
var path = require('path');
var ENV = process.env.NODE_ENV;

function getLogger( module ){
    var pathModule = module.filename.split("/").slice(-2).join('/');
    var level = (ENV == "development") ? "debug" : "error";

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level:  "info",
                label: pathModule
            }),
            new winston.transports.File({
                filename: path.join(__dirname, '/logRequest.log'),
                level: 'error',
                label: pathModule
            })
        ]
    });
}
module.exports = getLogger;
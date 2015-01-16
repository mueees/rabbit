var express = require('express'),
    route = require('./routes/route'),
    http = require('http'),
    HttpError = require('./errors/HttpError').HttpError,
    ServiceError = require('common/core/errors/service.error').ServiceError,
    logger = require('common/core/logs')(module),
    bodyParser = require('body-parser'),
    config = require('config');

var app = express();

app.use(bodyParser.json({type: 'application/x-www-form-urlencoded'}));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

//link database
require("common/mongooseDb");

//add modules

//add middlewares
app.use(require("./middleware/defForTest"));
app.use(require("./middleware/sendHttpError"));

if( process.env.NODE_ENV == "live" ){
    app.use(express.static('../../../client/bin'));
}else{
    app.use(express.static('../../../client/build/app'));
}

//routing
route(app);

//404
app.use(function(req, res, next){
    logger.warn('404', {
        status: 404,
        url: req.url,
        method: req.method
    });
    res.status(404);
    res.send({});
});

//error handler
app.use(function(err, req, res, next){
    if( typeof err == "number"){
        err = new HttpError(err);
    }

    if( err instanceof ServiceError ){
        logger.error(err);
        switch (err.status){
            case 500:
                res.sendError(new HttpError(400, "Cannot execute request"));
                break;
            case 400:
                res.sendError(err);
                break;
        }
    }else if( err instanceof HttpError ){
        logger.error(err);
        res.sendError(err);
    }else{
        logger.error(err);
        res.status(500);
        res.send(err);
    }
});

//create server
var server = http.createServer(app);
server.listen(config.get("services:api:port"));
logger.info("Web server listening: " + config.get("services:api:port"));
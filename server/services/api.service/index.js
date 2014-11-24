var express = require('express'),
    route = require('./routes/route'),
    http = require('http'),
    HttpError = require('./errors/HttpError').HttpError,
    logger = require('common/core/logs')(module),
    bodyParser = require('body-parser'),
    config = require('config');

var app = express();

app.use(bodyParser.json({type: 'application/x-www-form-urlencoded'}));

//link database
require("common/mongooseDb");

//add modules
require("./modules/dnode/index");

//add middlewares
app.use(require("./middleware/sendHttpError"));

//routing
route(app);

//404
app.use(function(req, res, next){
    logger.warn({ status: 404, url: req.url });
    res.send(404, {});
});

//error handler
app.use(function(err, req, res, next){
    if( typeof err == "number"){
        err = new HttpError(err);
    }

    if( err instanceof HttpError ){
        res.sendHttpError(err);
    }else{
        logger.error("500", err.message);
        console.log(err);
        res.status(500);
        res.send(err);
        /*if( app.get("env") == "development" ){
            express.errorHandler()(err, req, res, next);
        }else{
            express.errorHandler()(err, req, res, next);
            res.send(500);
        }*/
    }
});

//create server
var server = http.createServer(app);
server.listen(config.get("services:api:port"));
logger.info("Web server listening: " + config.get("services:api:port"));
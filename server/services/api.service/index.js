var express = require('express'),
    route = require('./routes/route'),
    http = require('http'),
    HttpError = require('./errors/HttpError').HttpError,
    ServiceError = require('common/core/errors/service.error').ServiceError,
    logger = require('common/core/logs')(module),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    config = require('config');

var app = express();

app.use(session({
    cookie: {
        maxAge: 2592000000
    },
    secret: 'keyboard cat'
}));

app.use(bodyParser.json({type: 'application/x-www-form-urlencoded'}));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

if( process.env.NODE_ENV == "live" ){
    app.use(express.static(__dirname + '/public/'));
}else{
    app.use(express.static('../client/build/app'));

    app.set('views', "../client/build/app");
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    //app.engine('html', require('ejs').renderFile);
}

//link database
require("common/mongooseDb");

//add modules

//add middlewares
//app.use(require("./middleware/defForTest"));
app.use(require("./middleware/sendHttpError"));

//routing
route(app);

//404
app.use(function(req, res, next){
    logger.warn({ status: 404, url: req.url });
    res.status(404);
    res.send({});
});

//error handler
app.use(function(err, req, res, next){
    if( typeof err == "number"){
        err = new HttpError(err);
    }

    if( err instanceof ServiceError ){
        switch (err.status){
            case 500:
                res.sendError(new HttpError(400, "Cannot execute request"));
                break;
            case 400:
                res.sendError(err);
                break;
        }
    }else if( err instanceof HttpError ){
        res.sendError(err);
    }else{
        logger.error("500", err.message);
        res.status(500);
        res.send(err);
    }
});

//create server
var server = http.createServer(app);
server.listen(config.get("services:api:port"));
logger.info("Web server listening: " + config.get("services:api:port"));
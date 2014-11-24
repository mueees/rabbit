var path = require("path");
var http = require("http");
var util = require("util");

function ServiceError(status, message){
    Error.apply(this, arguments);
    Error.captureStackTrace(this, ServiceError);

    this.status = status;
    this.message = message || "Error";
}

util.inherits(ServiceError, Error);
ServiceError.prototype.name = "ServiceError";

exports.ServiceError = ServiceError;
var config = require('config');
var authService = require('common/core/service/client')(config.get("services:auth:port"));
module.exports = authService;
var config = require('config');
var authService = require('common/core/service/client')(config.get("services:search:port"));
module.exports = authService;
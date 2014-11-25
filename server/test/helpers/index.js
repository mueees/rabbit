var api = {},
    _ = require('underscore'),
    dbApi = require('./db');

require('./chai');
_.extend(api, dbApi);
module.exports = api;

var checkoAuth = require('../middleware/checkAuth'),
    serviceConfig = require('../config'),
    HttpError = require('../errors/HttpError').HttpError;

var prefix = '/api/v' + serviceConfig.get('version');

module.exports = function (app) {
    app.get(prefix + '/api/categories', checkoAuth,  function (req, res, next) {
        res.send(200, {
            data: 'ok'
        })
    });
};
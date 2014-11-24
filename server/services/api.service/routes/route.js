var checkoAuth = require('../middleware/checkAuth'),
    serviceConfig = require('../config'),
    HttpError = require('../errors/HttpError').HttpError,
    getAuthService = require('../modules/dnode/index').getAuthService;

var prefix = '/api/v' + serviceConfig.get('version');

module.exports = function (app) {

    //auth
    app.post(prefix + '/user/signup', function (req, res, next) {
        var authService = getAuthService();
        authService.signup( req.body.email, req.body.password, function (err, user) {
            if( err ){
                return next( new HttpError( err.status, err.message ) );
            }
            res.status(200);
            res.send({
                _id: user._id
            });
        });
    });

    app.get('/api/categories', checkoAuth,  function (req, res, next) {
        res.send(200, {
            data: 'ok'
        })
    });
};
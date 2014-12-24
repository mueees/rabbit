var Controller = require('common/core/controller/base'),
    _ = require('underscore');

_.extend(Controller.prototype, {
    home: function (req, res, next) {
        res.render('index', {});
    }
});

module.exports = new Controller();
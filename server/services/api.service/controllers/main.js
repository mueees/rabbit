var Controller = require('common/core/controller/base'),
    _ = require('underscore');

_.extend(Controller.prototype, {
    home: function (req, res, next) {
        res.sendFile('index.html', {
            root: '../../../client/build/app'
        });
    }
});

module.exports = new Controller();
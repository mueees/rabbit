var Controller = require('common/core/controller/base'),
    _ = require('underscore'),
    logger = require('common/core/logs')(module),
    HttpError = require('../../errors/HttpError').HttpError,
    Q = require('q'),
    UserModel = require('common/resource/user.model'),
    util = require('util');

_.extend(Controller.prototype, {
    add: function (req, res, next, def) {
        var body = req.body;

        var name = body.name;

        if(!body.name){
            def.resolve({message: "Doesn't have category name"});
            return next(new HttpError(400, {
                message: "Doesn't have category name"
            }));
        }

        UserModel.addCategory(req.user._id, body.name, function (err, user, category) {
            if(err){
                logger.error(err);
                def.resolve({message: "Cannot add category"});
                return next(new HttpError(400, "Cannot add category"))
            }

            var data = {_id: category.id};
            def.resolve(data);
            res.status(200);
            res.status(data);
        });

    },

    edit: function (req, res, next, def) {
        var body = req.body;

        if(!body.name || !body._id){
            def.resolve({message: "Doesn't have name or id category"});
            return next(new HttpError(400, {
                message: "Doesn't have name or id category"
            }));
        }

        UserModel.editCategory(req.user._id, body.name, body._id, function (err, user, category) {
            if(err){
                logger.error(err);
                def.resolve({message: "Cannot edit category"});
                return next(new HttpError(400, "Cannot edit category"))
            }

            var data = {
                _id: category.id,
                name: body.name
            };
            def.resolve(data);
            res.status(200);
            res.status(data);
        });
    },

    remove: function (req, res, next, def) {
        var body = req.body;

        if(!body._id){
            def.resolve({message: "Doesn't have category id"});
            return next(new HttpError(400, {
                message: "Doesn't have category id"
            }));
        }

        UserModel.removeCategory(req.user._id, body._id, function (err) {
            if(err){
                logger.error(err);
                def.resolve({message: "Cannot remove category"});
                return next(new HttpError(400, "Cannot remove category"))
            }

            var data = {};
            def.resolve(data);
            res.status(200);
            res.status(data);

            /*
            * todo: make task to remove userdata from all post, that belong to feed that belong to this category
            * It isn't very important task, we can do this using some scheduler
            * */

        });

    }
});


module.exports = new Controller();
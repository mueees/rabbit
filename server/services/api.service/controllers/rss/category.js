var _ = require('underscore'),
    logger = require('common/core/logs')(module),
    HttpError = require('../../errors/HttpError').HttpError,
    Q = require('q'),
    UserModel = require('common/resource/user.model'),
    //Controller = require('common/core/controller/base'),
    util = require('util');

function Controller(){}

_.extend(Controller.prototype, {

    add: function (req, res, next) {
        var body = req.body;

        var name = body.name;

        if(!body.name){
            res.finish.resolve({message: "Doesn't have category name"});
            return next(new HttpError(400, {
                message: "Doesn't have category name"
            }));
        }

        UserModel.addCategory(req.user._id, body.name, function (err, user, category) {
            if(err){
                logger.error(err);
                res.finish.resolve({message: "Cannot add category"});
                return next(new HttpError(400, "Cannot add category"))
            }

            var data = {_id: category.id};

            res.finish.resolve(data);
            res.status(200);
            res.send(data);
        });

    },

    edit: function (req, res, next) {
        var body = req.body;


        if(!body.name || !body._id){
            res.finish.resolve({message: "Doesn't have name or id category"});
            return next(new HttpError(400, {
                message: "Doesn't have name or id category"
            }));
        }

        UserModel.editCategory(req.user._id, body.name, body._id, function (err, user, category) {
            if(err){
                logger.error(err);
                res.finish.resolve({message: "Cannot edit category"});
                return next(new HttpError(400, "Cannot edit category"))
            }

            var data = {
                _id: category.id,
                name: body.name
            };
            res.finish.resolve(data);
            res.status(200);
            res.send(data);
        });
    },

    remove: function (req, res, next) {
        var body = req.body;

        if(!body._id){
            res.finish.resolve({message: "Doesn't have category id"});
            return next(new HttpError(400, {
                message: "Doesn't have category id"
            }));
        }

        UserModel.removeCategory(req.user._id, body._id, function (err) {
            if(err){
                logger.error(err);
                res.finish.resolve({message: "Cannot remove category"});
                return next(new HttpError(400, "Cannot remove category"))
            }

            var data = {};
            res.finish.resolve(data);
            res.status(200);
            res.send(data);

            /*
            * todo: make task to remove userdata from all post, that belong to feed that belong to this category
            * It isn't very important task, we can do this using some scheduler
            * */

        });

    },

    list: function (req, res, next) {

        UserModel.findById(req.user._id, {
            "categories.name": true,
            _id: false,
            "categories._id": true
        }, function (err, result) {
            if(err){
                logger.error(err);
                res.finish.resolve({message: "Cannot get category list"});
                return next(new HttpError(400, "Cannot get category list"))
            }

            res.finish.resolve(result.categories);
            res.status(200);
            res.send(result.categories);
        });
    },

    listFeed: function (req, res, next) {
        UserModel.findById(req.user._id, {
            "categories.name": true,
            _id: false,
            "categories._id": true,
            "categories.feeds": true
        }, function (err, result) {
            if(err){
                logger.error(err);
                res.finish.resolve({message: "Cannot get category list feed"});
                return next(new HttpError(400, "Cannot get category list feed"))
            }

            res.finish.resolve(result.categories);
            res.status(200);
            res.send(result.categories);
        });
    }

});

module.exports = new Controller();
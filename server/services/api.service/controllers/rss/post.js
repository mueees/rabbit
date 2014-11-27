var _ = require('underscore'),
    logger = require('common/core/logs')(module),
    HttpError = require('../../errors/HttpError').HttpError,
    Q = require('q'),
    UserModel = require('common/resource/user.model'),
    PostModel = require('common/resource/post.model'),
    async = require('async'),
    util = require('util');

function Controller(){}

_.extend(Controller.prototype, {

    /*
    * Check post like as read
    * @param {String} _id This is id post
    * */
    read: function (req, res, next, def) {
        var data = req.body;

        if( !data._id ){
            def.resolve({message: "Doesn't have post id"});
            return next(new HttpError(400, {
                message: "Doesn't have post id"
            }));
        }

        PostModel.readUnread( req.user._id, data._id, true, function (err) {
            if(err){
                def.resolve({message: "Cannot check post read"});
                return next(new HttpError(400, {
                    message: "Cannot check post read"
                }));
            }
            def.resolve({});
            res.status(200);
            res.status({});
        });
    },

    /*
     * Check post like as unread
     * @param {String} _id This is id post
     * */
    unread: function (req, res, next, def) {
        var data = req.body;

        if( !data._id ){
            def.resolve({message: "Doesn't have post id"});
            return next(new HttpError(400, {
                message: "Doesn't have post id"
            }));
        }

        PostModel.readUnread( req.user._id, data._id, false, function (err) {
            if(err){
                def.resolve({message: "Cannot check post read"});
                return next(new HttpError(400, {
                    message: "Cannot check post read"
                }));
            }
            def.resolve({});
            res.status(200);
            res.status({});
        });
    },

    /*
     * Check post reading later
     * @param {String} _id This is id post
     * */
    check: function (req, res, next, def) {
        var data = req.body;

        if( !data._id ){
            def.resolve({message: "Doesn't have post id"});
            return next(new HttpError(400, {
                message: "Doesn't have post id"
            }));
        }

        PostModel.checkUncheck( req.user._id, data._id, true, function (err) {
            if(err){
                def.resolve({message: "Cannot check post read"});
                return next(new HttpError(400, {
                    message: "Cannot check post read"
                }));
            }
            def.resolve({});
            res.status(200);
            res.status({});
        });
    },

    /*
     * Uncheck post reading later
     * @param {String} _id This is id post
     * */
    uncheck: function (req, res, next, def) {
        var data = req.body;

        if( !data._id ){
            def.resolve({message: "Doesn't have post id"});
            return next(new HttpError(400, {
                message: "Doesn't have post id"
            }));
        }

        PostModel.checkUncheck( req.user._id, data._id, false, function (err) {
            if(err){
                def.resolve({message: "Cannot uncheck post read"});
                return next(new HttpError(400, {
                    message: "Cannot uncheck post read"
                }));
            }
            def.resolve({});
            res.status(200);
            res.status({});
        });
    }

});

module.exports = new Controller();
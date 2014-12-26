var _ = require('underscore'),
    logger = require('common/core/logs')(module),
    HttpError = require('../../errors/HttpError').HttpError,
    Q = require('q'),
    validator = require('validator'),
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
    read: function (req, res, next) {
        var data = req.body;

        if( !data._id ){
            res.finish.resolve({message: "Doesn't have post id"});
            return next(new HttpError(400, {
                message: "Doesn't have post id"
            }));
        }

        PostModel.readUnread( req.user._id, data._id, true, function (err) {
            if(err){
                res.finish.resolve({message: "Cannot check post read"});
                return next(new HttpError(400, {
                    message: "Cannot check post read"
                }));
            }
            res.finish.resolve({});
            res.status(200);
            res.send({});
        });
    },

    /*
     * Check post like as unread
     * @param {String} _id This is id post
     * */
    unread: function (req, res, next) {
        var data = req.body;

        if( !data._id ){
            res.finish.resolve({message: "Doesn't have post id"});
            return next(new HttpError(400, {
                message: "Doesn't have post id"
            }));
        }

        PostModel.readUnread( req.user._id, data._id, false, function (err) {
            if(err){
                res.finish.resolve({message: "Cannot check post read"});
                return next(new HttpError(400, {
                    message: "Cannot check post read"
                }));
            }
            res.finish.resolve({});
            res.status(200);
            res.send({});
        });
    },

    /*
     * Check post reading later
     * @param {String} _id This is id post
     * */
    check: function (req, res, next) {
        var data = req.body;

        if( !data._id ){
            res.finish.resolve({message: "Doesn't have post id"});
            return next(new HttpError(400, {
                message: "Doesn't have post id"
            }));
        }

        PostModel.checkUncheck( req.user._id, data._id, true, function (err) {
            if(err){
                res.finish.resolve({message: "Cannot check post read"});
                return next(new HttpError(400, {
                    message: "Cannot check post read"
                }));
            }
            res.finish.resolve({});
            res.status(200);
            res.send({});
        });
    },

    /*
     * Uncheck post reading later
     * @param {String} _id This is id post
     * */
    uncheck: function (req, res, next) {
        var data = req.body;

        if( !data._id ){
            res.finish.resolve({message: "Doesn't have post id"});
            return next(new HttpError(400, {
                message: "Doesn't have post id"
            }));
        }

        PostModel.checkUncheck( req.user._id, data._id, false, function (err) {
            if(err){
                res.finish.resolve({message: "Cannot uncheck post read"});
                return next(new HttpError(400, {
                    message: "Cannot uncheck post read"
                }));
            }
            res.finish.resolve({});
            res.status(200);
            res.send({});
        });
    },

    /*
     * Get posts by some filters
     * @param {Object} source Source where search posts
     * @param {Object} source.name Possible value feed || tag || category
     * @param {Object} source.params Params for source
     * @param {String} from Start point ( skip for mongoose )
     * @param {String} count End point
     * @param {String} readLater Exclude or Include post that mark readLater
     * */
    getPosts: function (req, res, next) {
        var defaultOptions = {
            from: 0,
            count: 20
        },
            allowedSource = ['feed'];
        var body = req.body;
        var errors = [];

        var options = _.extend(defaultOptions, body);

        if( !options.source ||
            !options.source.name ||
            !options.source.params ||
            !options.source.params._id){
            errors.push('Cannot find resource');
        }

        if( !validator.isIn(options.source.name, allowedSource) ){
            errors.push('Resource is not recognized');
        }

        if(errors.length){
            res.finish.resolve({message: "Cannot find resource"});
            return next(new HttpError(400, {
                message: errors
            }));
        }

        if( req.user ){
            options.user = {};
            options.user._id = req.user._id;
        }

        PostModel.getPosts(options, function (err, posts) {
            if(err){
                logger.error(err.message);
                res.finish.resolve({message: err.message});
                return next(new HttpError(400, {
                    message: err
                }));
            }

            res.finish.resolve(posts);
            res.status(200);
            res.send(posts);
        });

    }

});

module.exports = new Controller();
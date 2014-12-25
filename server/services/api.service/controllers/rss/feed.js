var _ = require('underscore'),
    logger = require('common/core/logs')(module),
    HttpError = require('../../errors/HttpError').HttpError,
    Q = require('q'),
    UserModel = require('common/resource/user.model'),
    FeedModel = require('common/resource/feed.model'),
    async = require('async'),
    util = require('util');

function Controller(){}

_.extend(Controller.prototype, {

    /*
    * Add new feed
    * @param {String} feedId
    * @param {String} userId
    * @param {String} name Feed name. Or if doesn't exist, get default feed name.
    * @param {String} categoryId
    * */
    add: function (req, res, next) {
        var body = req.body;

        if(!body.feedId || !body.categoryId){
            res.finish.resolve({message: "Doesn't have category or feed id"});
            return next(new HttpError(400, {
                message: "Doesn't have category or feed id"
            }));
        }
        async.parallel([
            //find feed
            function (cb) {
                FeedModel.findById(body.feedId, function (err, feed) {
                    if(err){
                        return cb("Cannot find feed by id");
                    }
                    cb(null, feed);
                })
            },
            //find user and check if category exist
            function (cb) {
                UserModel.isExistCategory(req.user._id, body.categoryId, function (err, category, user) {
                    if(err){
                        return cb("Cannot find user by id");
                    }
                    cb(null, {
                        user: user,
                        category: category
                    });
                });
            }
        ], function (err, results) {
            if(err){
                logger.error(err);
                res.finish.resolve({message: err});
                return next(new HttpError(400, err))
            }

            var feed = results[0];
            var userData = results[1];
            userData.user.categories.id(body.categoryId).feeds.push({
                feedId: feed._id,
                name: body.name || feed.name
            });
            userData.user.save(function (err) {
                if(err){
                    logger.error(err);
                    res.finish.resolve({message: err});
                    return next(new HttpError(400, "Cannot add feed to category"))
                }

                res.finish.resolve({});
                res.status(200);
                res.status({});
            })
        });
    },

    /*
    * Change name for feed
    * @param {String} name New name for feed
    * @param {String} _id feed id
    * */
    edit: function (req, res, next) {
        var body = req.body;

        if(!body.name || !body._id){
            res.finish.resolve({message: "Doesn't have name or feed id"});
            return next(new HttpError(400, {
                message: "Doesn't have name or feed id"
            }));
        }

        UserModel.editName(req.user._id, body.name, body._id, function (err) {
            if(err){
                logger.error(err);
                res.finish.resolve({message: "Cannot edit feed"});
                return next(new HttpError(400, "Cannot edit feed"))
            }

            var data = {};
            res.finish.resolve(data);
            res.status(200);
            res.status(data);
        });
    },

    /*
    * Remove feed from user category
    * @description Required only feedId, category, that store this feed, we should find automatically
    * @param {String} feedId
    * */
    remove: function (req, res, next) {
        var body = req.body;

        if(!body.feedId){
            res.finish.resolve({message: "Doesn't have feed id"});
            return next(new HttpError(400, {
                message: "Doesn't have feed id"
            }));
        }

        UserModel.removeFeed(req.user._id, body.feedId, function (err) {
            if(err){
                logger.error(err);
                res.finish.resolve({message: "Cannot remove feed"});
                return next(new HttpError(400, "Cannot remove feed"))
            }

            var data = {};
            res.finish.resolve(data);
            res.status(200);
            res.status(data);
        });

        /*
         * todo: make task to remove userdata from all post, that belong to this feed
         * It isn't very important task, we can do this using some scheduler
         * */

     },

    /*
    * Change feed category
    * @param {String} categoryId This is new category id
    * @param {String} feedId
    * */
    changeCategory: function (req, res, next) {
        var body = req.body;

        if(!body.feedId || !body.categoryId){
            res.finish.resolve({message: "Doesn't have feed or category id"});
            return next(new HttpError(400, {
                message: "Doesn't have feed or category id"
            }));
        }

        UserModel.changeCategoryForFeed(req.user._id, body.categoryId, body.feedId, function (err, user) {
            if(err){
                logger.error(err);
                res.finish.resolve({message: "Cannot change category for feed"});
                return next(new HttpError(400, "Cannot change category for feed"))
            }

            var data = {};
            res.finish.resolve(data);
            res.status(200);
            res.status(data);
        });
    },

    /*
    * Get information about feed
    * @param {String} id This is feed id
    * */
    getFeedById: function (req, res, next) {

        FeedModel.findById(req.params.id, function (err, feed) {
            if(err){
                logger.error(err);
                res.finish.resolve(err);
                return next(new HttpError(400, {
                    message: "Doesn't have feed"
                }));
            }

            if(!feed){
                logger.error(err);
                res.finish.resolve(err);
                return next(new HttpError(400, {
                    message: "Cannot find feed"
                }));
            }
            feed = feed.toObject();

            if( !req.user ){
                feed.isFollowed = false;
                res.finish.resolve(feed);
                res.status(200);
                res.send(feed);
                return false;
            }else{
                UserModel.isHaveFeed(req.user._id, req.params.id, function (err, userFeed) {
                    if(err){
                        logger.error(err);
                        res.finish.resolve(err);
                        return next(new HttpError(400, {
                            message: err
                        }));
                    }
                    if(userFeed) {
                        feed.isFollowed = true;
                    }else{
                        feed.isFollowed = false;
                    }

                    res.finish.resolve(feed);
                    res.status(200);
                    res.send(feed);
                });
            }
        })
    }
});

module.exports = new Controller();
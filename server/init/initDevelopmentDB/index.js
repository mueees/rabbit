var dbHelpers = require("common/helpers/db");
var Q = require("q"),
    async = require('async'),
    setup = require('./setup.json'),
    UserModel = require('common/resource/user.model'),
    PostModel = require('common/resource/post.model'),
    FeedModel = require('common/resource/feed.model'),
    logger = require("common/core/logs")(module);

var options = {
        user: {
            email: 'mue.miv@gmail.com',
            pass: '123123'
        },
        category: ['Web', "With long long name"],
        feeds: [
            {
                name: "Habrahabr.ru",
                url: 'http://Habrahabr.ru'
            }, {
                name: "Fake long name super super long.ru",
                url: 'http://Habrahabr.ru'
            }
        ]
    },
    user,
    categories = [],
    feeds = [];

/*init database*/
require('common/mongooseDb');

/*
 * 1. Clear DB
 * 2. Create user
 *       email: mue.miv@gmail.com
 *       pass: 123123
 * 3. Add Category
 *       - Web
 *       - With long long name
 * 4. Add Feeds to
 *       - Web Category
 *       - With long long name Category
 * 5. Add posts to Feed
 *
 * */

dbHelpers.db.clearDb().then(function () {

    /*Create User */
    UserModel.create(setup.user, function (err, newUser) {
        if(err){
            logger.error(err);
            process.exit();
        }

        user = newUser;
        logger.info('Create user and categories for user');

        FeedModel.create(setup.feeds, function (err) {
            if(err){
                logger.error(err);
                process.exit();
            }
            logger.info('Feeds was created');

            feeds = [].splice.call(arguments,0);
            feeds.splice(0, 1);

            for(var j = 0; j < user.categories.length; j++){
                for(var i = 0; i < feeds.length; i++){
                    user.categories[j].feeds.push({
                        feedId: feeds[i]._id,
                        name: feeds[i].name
                    })
                }
            }

            user.save(function (err, cb) {
                if(err){
                    logger.error(err);
                    process.exit();
                }
                logger.info('Feeds was added to category');
            });


            for(var i = 0; i < feeds.length; i++){
                setup.posts.forEach(function (post) {
                    post['feedId'] = feeds[i]._id
                });
            }

            PostModel.create(setup.posts, function (err, posts) {
                if(err){
                    logger.error(err);
                    process.exit();
                }

                var postOne = posts;
                postOne.users.push(
                    {
                        userId: user._id
                    },
                    {
                        userId: "54aa46a9f3d8f6b0065cfake"
                    }
                );

                postOne.save(function (err) {
                    if(err){
                        logger.error(err);
                        process.exit();
                    }

                    logger.info('Posts was created');
                    logger.info("Init Development Database was ended");
                    process.exit();
                });

            });

        });

    });

});
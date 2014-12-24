var serviceConfig = require('../config'),
    checkAuth = require('../middleware/checkAuth');
var prefix = '/api/v' + serviceConfig.get('version') + '/rss/application';

/*Controllers*/
var main = require('../controllers/main');
var userController = require('../controllers/user');
var categoryController = require('../controllers/rss/category');
var feedController = require('../controllers/rss/feed');
var postController = require('../controllers/rss/post');

module.exports = function (app) {

    app.get('/', main.home);

    /*******
     * USER
     *******/
    app.post(prefix + '/user/signup', userController.signup);

    app.get(prefix + '/user/confirmuser', userController.confirmuser);

    //app.get(prefix + '/user/resendemail', userController.resendemail);

    app.post(prefix + '/user/signin', userController.signin);

    /*******
    * RSS
    *******/

    //category

    /* Just list of categories */
    app.get(prefix + '/rss/category/list', categoryController.list);

    /* List of categories with all feeds*/
    //todo: after api feed.add
    //app.get(prefix + '/rss/category/list/feed', categoryController.listFeed);

    /*Add new category*/
    app.post(prefix + '/rss/category/add', checkAuth, categoryController.add);

    /*Edit category*/
    app.post(prefix + '/rss/category/remove', categoryController.edit);

    /*Remove category*/
    app.post(prefix + '/rss/category/remove', categoryController.remove);

    //feed

    /*Add new feed*/
    app.post(prefix + '/rss/feed/add', checkAuth,  feedController.add);

    /*Edit feed*/
    app.post(prefix + '/rss/feed/edit', checkAuth, feedController.edit);

    /* Change category for feed */
    app.post(prefix + '/rss/feed/change/category', checkAuth, feedController.changeCategory);

    /*Remove feed*/
    app.post(prefix + '/rss/feed/remove', checkAuth, feedController.remove);

    /*Mark all post as read*/
    //app.post(prefix + '/rss/feed/mark/read', rssController.feed.read);

    /*Mark all post as unread*/
    //app.post(prefix + '/rss/feed/mark/unread', rssController.feed.unread);

    //post

    /*Mark post as readed*/
    app.post(prefix + '/rss/post/mark/read', checkAuth, postController.read);

    /*Mark post as unreaded*/
    app.post(prefix + '/rss/post/mark/unread', postController.unread);

    /*Mark for reading later*/
    app.post(prefix + '/rss/post/readlater/check', postController.check);

    /*Uncheck reading later state*/
    app.post(prefix + '/rss/post/readlater/uncheck', postController.uncheck);

    /*Get posts by feed url */
    //app.post(prefix + '/rss/post/byurl', rssController.post.byurl);

    /*Get posts by some filter*/
    //app.post(prefix + '/rss/post/filter', rssController.post.filter);

};
var serviceConfig = require('../config'),
    checkAuth = require('../middleware/checkAuth');
var prefix = '/api/v' + serviceConfig.get('version');

/*Controllers*/
var userController = require('../controllers/user');
var categoryController = require('../controllers/rss/category');

module.exports = function (app) {

    /*******
     * USER
     *******/
    app.post(prefix + '/user/signup', userController.signup);

    app.get(prefix + '/user/confirmuser', userController.confirmuser);

    //app.get(prefix + '/user/resendemail', userController.resendemail);

    app.get(prefix + '/user/signin', userController.signin);


    /*******
    * RSS
    *******/

    //category

    /* Just list of categories */
    //app.get(prefix + '/rss/category/list', rssController.category.list);

    /* List of categories with all feeds*/
    //app.get(prefix + '/rss/category/list/feed', rssController.category.listFeed);

    /*Add new category*/
    app.post(prefix + '/rss/category/add', checkAuth, categoryController.add);

    /*Edit category*/
    app.post(prefix + '/rss/category/remove', categoryController.edit);

    /*Remove category*/
    app.post(prefix + '/rss/category/remove', categoryController.remove);

    //feed

    /*Add new feed*/
    //app.post(prefix + '/rss/feed/add', rssController.feed.add);

    /*Edit feed*/
    //app.post(prefix + '/rss/feed/remove', rssController.feed.edit);

    /*Remove feed*/
    //app.post(prefix + '/rss/feed/remove', rssController.feed.remove);

    /*Mark all post as read*/
    //app.post(prefix + '/rss/feed/mark/read', rssController.feed.read);

    /*Mark all post as unread*/
    //app.post(prefix + '/rss/feed/mark/unread', rssController.feed.unread);

    //post

    /*Mark post as readed*/
    //app.post(prefix + '/rss/post/mark/read', rssController.post.read);

    /*Mark post as unreaded*/
    //app.post(prefix + '/rss/post/mark/unread', rssController.post.unread);

    /*Mark for reading later*/
    //app.post(prefix + '/rss/post/readlater/check', rssController.post.check);

    /*Uncheck reading later state*/
    //app.post(prefix + '/rss/post/readlater/uncheck', rssController.post.uncheck);

    /*Get posts by feed url */
    //app.post(prefix + '/rss/post/byurl', rssController.post.byurl);

    /*Get posts by some filter*/
    //app.post(prefix + '/rss/post/filter', rssController.post.filter);

};
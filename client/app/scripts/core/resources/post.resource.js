(function () {
    'use strict';
    angular.module('rss.core.resources').factory('rssPostResource', function (rssResource) {
        var PostResource = rssResource.withConfig(function(RestangularConfigurer){

            /*RestangularConfigurer.setRestangularFields({
                id: "_id"
            });*/

            RestangularConfigurer.addElementTransformer('post', true, function (post) {
                post.addRestangularMethod('getPosts', 'post', 'getPosts', undefined);
                return post;
            });

            RestangularConfigurer.addElementTransformer('post', false, function (post) {
                post.addRestangularMethod('read', 'post', 'mark/read', undefined);
                return post;
            });

            RestangularConfigurer.extendModel('post', function(posts) {
                if(rss.util.isArrayLike(posts)){
                    PostResource.restangularizeCollection(null, posts, 'post');
                }
                return posts;
            });

        });

        return PostResource.all('post');
    });
})();


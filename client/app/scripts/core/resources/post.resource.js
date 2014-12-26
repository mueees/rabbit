(function () {
    'use strict';
    angular.module('rss.core.resources').factory('rssPostResource', function (rssResource) {
        var PostResource = rssResource.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.addElementTransformer('post', function (post) {
                post.addRestangularMethod('getPosts', 'post', 'getPosts', undefined);
                return post;
            });
        });
        return PostResource.one('post');
    });
})();
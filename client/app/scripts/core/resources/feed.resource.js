(function () {
    'use strict';
    angular.module('rss.core.resources').factory('rssFeedResource', function (rssResource) {
        var FeedResource = rssResource.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.addElementTransformer('feed', false, function (feed) {
                feed.addRestangularMethod('getById', 'post', 'getById', undefined);
                return feed;
            });
        });
        return FeedResource.one('feed');
    });
})();
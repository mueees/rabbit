(function () {
    'use strict';
    angular.module('rss.core.resources').factory('rssFeedResource', function (rssResource) {
        var FeedResource = rssResource.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.addElementTransformer('feed', function (feed) {
                feed.addRestangularMethod('getById', 'post', 'getById', undefined);
                feed.addRestangularMethod('add', 'post', 'add', undefined);
                return feed;
            });
        });

        /*return {
            remove: function (_id) {
                FeedResource.one('feed')
            }
        };*/
        return FeedResource.one('feed');
    });
})();
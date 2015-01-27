(function () {
    'use strict';
    angular.module('rss.core.resources').factory('rssFeedResource', function (rssResource) {
        var FeedResource = rssResource.withConfig(function(RestangularConfigurer){

            //element
            RestangularConfigurer.addElementTransformer('feed', false, function (feed) {
                feed.addRestangularMethod('add', 'post', 'add', undefined);
                feed.addRestangularMethod('remove', 'post', 'remove', undefined, {}, {
                    _id: feed._id
                });
                return feed;
            });

            //collection
            RestangularConfigurer.addElementTransformer('feed', true, function (feed) {
                feed.addRestangularMethod('getById', 'post', 'getById', undefined);
                return feed;
            });

        });

        return {
            getById: function (_id) {
                return FeedResource.one('feed').one(_id).get();
            },
            removeById: function (_id) {
                var feed = FeedResource.one('feed');
                return feed.remove({
                    _id: _id
                });
            }
        };
    });
})();
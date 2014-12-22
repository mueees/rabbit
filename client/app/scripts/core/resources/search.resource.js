(function () {
    'use strict';
    angular.module('rss.core.resources').factory('rssSearchResource', function (rssResource) {
        var SearchResource = rssResource.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.addElementTransformer('search', false, function (search) {
                search.addRestangularMethod('find', 'post', 'find', undefined);
                return search;
            });
        });
        return SearchResource.one('search');
    });
})();
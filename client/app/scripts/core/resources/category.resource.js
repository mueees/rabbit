(function () {
    'use strict';
    angular.module('rss.core.resources').factory('rssCategoryResource', function (rssResource) {
        var CategoryResource = rssResource.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.addElementTransformer('category', function (category) {
                category.addRestangularMethod('listFeed', 'get', 'list/feed', undefined);
                category.addRestangularMethod('add', 'post', 'add', undefined);
                category.addRestangularMethod('list', 'get', 'list', undefined);
                return category;
            });

            /*RestangularConfigurer.addElementTransformer('categories', false, function (categories) {
                categories.addRestangularMethod('add', 'post', 'add', undefined);
                return categories;
            });*/
        });
        return CategoryResource.all('category');
    });
})();
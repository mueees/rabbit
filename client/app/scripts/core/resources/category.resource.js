(function () {
    'use strict';
    angular.module('rss.core.resources').factory('rssCategoryResource', function (rssResource) {
        var CategoryResource = rssResource.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.addElementTransformer('categories', function (categories) {
                categories.addRestangularMethod('getFullCategories', 'get', 'getFullCategories', undefined);
                categories.addRestangularMethod('add', 'post', 'add', undefined);
                categories.addRestangularMethod('list', 'get', 'list', undefined);
                return categories;
            });

            /*RestangularConfigurer.addElementTransformer('categories', false, function (categories) {
                categories.addRestangularMethod('add', 'post', 'add', undefined);
                return categories;
            });*/
        });
        return CategoryResource.all('categories');
    });
})();
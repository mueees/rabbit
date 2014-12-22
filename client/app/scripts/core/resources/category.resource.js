(function () {
    'use strict';
    angular.module('rss.core.resources').factory('rssCategoryResource', function (rssResource) {
        var CategoryResource = rssResource.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.addElementTransformer('categories', true, function (user) {
                user.addRestangularMethod('getFullCategories', 'get', 'getFullCategories', undefined);
                return user;
            });
        });
        return CategoryResource.all('categories');
    });
})();
(function () {
    'use strict';
    angular.module('rss.core.resources').factory('rssCategoryResource', function (rssResource) {
        var CategoryResource = rssResource.withConfig(function (RestangularConfigurer) {

            //Element
            RestangularConfigurer.addElementTransformer('category', false, function (category) {
                category.addRestangularMethod('add', 'post', 'add', undefined);
                category.addRestangularMethod('remove', 'post', 'remove', undefined, {}, {
                    _id: category._id
                });
                category.addRestangularMethod('edit', 'post', 'edit', undefined, {});
                return category;
            });

            //Collection
            RestangularConfigurer.addElementTransformer('category', true, function (category) {
                category.addRestangularMethod('list', 'get', 'list', undefined);
                category.addRestangularMethod('listFeed', 'get', 'list/feed', undefined);
                return category;
            });

            RestangularConfigurer.extendModel('category', function(category) {
                if(rss.util.isArrayLike(category)){
                    var newCategory = [];
                    angular.forEach(category, function (cat) {
                        newCategory.push(CategoryResource.restangularizeElement(null, cat, 'category'));
                    });
                    category = newCategory;
                }

                return category;
            });
        });

        var api = {
            listFeed: function () {
                var category = CategoryResource.all('category');
                return category.listFeed();
            }
        };

        return api;
    });
})();
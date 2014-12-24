(function(){
    'use strict';
    angular.module('rss.core.components.feed.choose-category').directive('rssChooseCategory', function (rssWebComponent, rssCategoryResource) {
        return rssWebComponent.RssUiComponentClass({
            link: function (scope) {
                var config = scope.rssConfiguration.getConfiguration();

                scope.selectedCategories = [];
                scope.categories = [];

                angular.extend(config, {
                    addCategory: _addCategory
                });

                function _addCategory(category) {
                    scope.categories.push(category);
                    category.selected = true;
                }

                rssCategoryResource.list().then(function (categories) {
                    scope.categories = categories;
                }, function () {
                    alert('Cannot fetch category list');
                });

                scope.$watch('categories|filter:{selected:true}', function (categories) {
                    config.categories = scope.selectedCategories = categories.map(function (category) {
                        return category._id;
                    });
                }, true);

            },

            restrict: "E",
            templateUrl: "app/scripts/core/components/feed/choose-category/choose-category.directive.view.html"
        });
    });
})();
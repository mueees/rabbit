(function(){
    'use strict';
    angular.module('rss.core.components.feed.add-category').directive('rssAddCategory', function (rssWebComponent, rssCategoryResource) {
        return rssWebComponent.RssUiComponentClass({
            link: function (scope) {
                var config = scope.rssConfiguration.getConfiguration();

                scope.addCategory = function () {
                    if(!scope.name) return false;

                    rssCategoryResource.add({
                        name: scope.name
                    }).then(function (data) {
                        config.newCategory({
                            name: scope.name,
                            _id: data._id
                        });
                    }).finally(function () {
                        scope.name = '';
                    });

                }
            },

            restrict: "E",
            templateUrl: "app/scripts/core/components/feed/add-category/add-category.directive.view.html"
        });
    });
})();
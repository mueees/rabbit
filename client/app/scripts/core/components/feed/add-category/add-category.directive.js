(function(){
    'use strict';
    angular.module('rss.core.components.feed.add-category').directive('rssAddCategory', function (rssWebComponent, rssCategoryResource) {
        return rssWebComponent.RssUiComponentClass({
            link: function (scope) {
                var config = scope.rssConfiguration.getConfiguration();
            },

            restrict: "E",
            templateUrl: "app/scripts/core/components/feed/add-category/add-category.directive.view.html"
        });
    });
})();
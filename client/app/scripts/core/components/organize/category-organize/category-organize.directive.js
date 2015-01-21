(function(){
    'use strict';
    angular.module('rss.core.components.organize.organize').directive('rssCategoryOrganize', function (rssWebComponent) {
        return rssWebComponent.RssUiComponentClass({
            restrict: "E",

            templateUrl: "app/scripts/core/components/organize/category-organize/category-organize.directive.view.html",

            link: function (scope, element, attrs, controllers) {
                scope.category = scope.rssConfiguration.getConfiguration();

                scope.deleteCategory = function () {
                    console.log("DELETE");
                }
            }
        });
    });
})();
(function(){
    'use strict';
    angular.module('rss.core.components.organize.organize-panel').directive('rssCategoryOrganizePanel', function ($timeout, rssCategoryResource) {

        return {

            scope: {
                rssConfiguration: "="
            },

            restrict: "E",

            templateUrl: "app/scripts/core/components/organize/category-organize-panel/category-organize-panel.directive.view.html",

            link: function (scope, element, attrs, controllers) {
                scope.category = scope.rssConfiguration;
            }
        };
    });

})();
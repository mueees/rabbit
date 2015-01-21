(function(){
    'use strict';
    angular.module('rss.core.components.organize.organize').directive('rssOrganize', function (rssWebComponent, rssCategoryResource) {

        return rssWebComponent.RssUiComponentClass({
            restrict: "E",

            templateUrl: "app/scripts/core/components/organize/organize/organize.directive.view.html",

            link: function (scope, element, attrs, controllers) {

                scope.categories = [];

                rssCategoryResource.listFeed().then(function (categories) {
                    scope.categories = categories;
                });
                scope.deleteCategory = function (category) {
                    console.log('delete');
                }
            }
        });
    });

})();
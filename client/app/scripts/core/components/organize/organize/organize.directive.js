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

                scope.categoryApi = {
                    deleteCategory: function (_id) {
                        deleteCategory(_id);
                    }
                };

                function deleteCategory (_id) {
                    scope.categories = _.without(scope.categories, _.findWhere(scope.categories, {_id: _id}));
                }
            }
        });
    });

})();
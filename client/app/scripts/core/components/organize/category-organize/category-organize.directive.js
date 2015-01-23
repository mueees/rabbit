(function(){
    'use strict';
    angular.module('rss.core.components.organize.organize').directive('rssCategoryOrganize', function (rssWebComponent) {
        return rssWebComponent.RssUiComponentClass({
            restrict: "E",

            templateUrl: "app/scripts/core/components/organize/category-organize/category-organize.directive.view.html",

            link: function (scope, element, attrs, controllers) {
                var config = scope.rssConfiguration.getConfiguration(),
                    categoryApi = config.categoryApi;

                scope.category = config.category;

                scope.actionDeleteConfig = {
                    accept: function () {
                        scope.deleteCategory();
                    },
                    close: function () {
                        scope.toggleDeleteCategory();
                    },
                    text: "Do you really want to delete category?",
                    textAccept: "Delete"
                };

                scope.getFeedCategory = function () {
                    return {
                        text: "Do you really want to delete "
                    }
                };

                scope.$on('close', function () {
                    debugger;
                });

                scope.isShowDeleteCategory = false;

                scope.toggleDeleteCategory = function (event) {
                    if(event) event.stopPropagation();
                    scope.isShowDeleteCategory = !scope.isShowDeleteCategory;
                };

                scope.deleteCategory = function () {
                    scope.category.remove().then(function () {
                        categoryApi.deleteCategory(scope.category._id);
                    });
                };
            }
        });
    });
})();
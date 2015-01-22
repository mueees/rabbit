(function(){
    'use strict';
    angular.module('rss.core.components.organize.organize').directive('rssCategoryOrganize', function (rssWebComponent) {
        return rssWebComponent.RssUiComponentClass({
            restrict: "E",

            templateUrl: "app/scripts/core/components/organize/category-organize/category-organize.directive.view.html",

            link: function (scope, element, attrs, controllers) {
                scope.category = scope.rssConfiguration.getConfiguration();

                scope.actionDeleteConfig = {
                    accept: function () {
                        scope.deleteCategory();
                    },
                    close: function () {
                        scope.toggleDeletePanel();
                    },
                    text: "Do you really want to delete category?",
                    textAccept: "Delete"
                };

                scope.isShowDeletePanel = false;
                scope.toggleDeletePanel = function (event) {
                    if(event) event.stopPropagation();
                    scope.isShowDeletePanel = !scope.isShowDeletePanel;
                };

                scope.deleteCategory = function () {
                    console.log("DELETE " + scope.category._id);
                }
            }
        });
    });
})();
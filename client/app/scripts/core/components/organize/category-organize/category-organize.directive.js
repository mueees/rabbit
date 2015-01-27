(function(){
    'use strict';
    angular.module('rss.core.components.organize.organize').directive('rssCategoryOrganize', function (rssWebComponent, rssFeedResource) {
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

                scope.getFeedActionConfig = function (feed) {
                    return {
                        text: "Do you really want to delete " + feed.name,
                        textAccept: "Delete feed",
                        close: function () {
                            scope.toggleFeedDeletePanel(feed);
                        },
                        accept: function () {
                            scope.deleteFeed(feed);
                        }
                    }
                };

                scope.isShowDeleteCategory = false;

                scope.toggleDeleteCategory = function (event) {
                    if(event) event.stopPropagation();
                    scope.isShowDeleteCategory = !scope.isShowDeleteCategory;
                };

                scope.toggleFeedDeletePanel = function (feed) {
                    feed.showActivePanel = !feed.showActivePanel;
                };

                scope.deleteCategory = function () {
                    scope.category.remove().then(function () {
                        categoryApi.deleteCategory(scope.category._id);
                    });
                };

                scope.deleteFeed = function (feed) {
                    scope.category.feeds = _.without(scope.category.feeds, _.findWhere(scope.category.feeds, {_id: feed._id}));
                    /*rssFeedResource.remove(feed._id).then(function () {
                     scope.category.feeds = _.without(scope.category.feeds, _.findWhere(scope.category.feeds, {_id: feed._id}));
                    });*/
                };

            }
        });
    });
})();
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

                scope.actionDeleteCategory = {
                    accept: function () {
                        scope.deleteCategory();
                    },
                    close: function () {
                        scope.toggleDeleteCategory();
                    },
                    text: "Do you really want to delete category?",
                    textAccept: "Delete",
                    type: 'confirm'
                };
                scope.actionEditCategory = {
                    accept: function (newName) {
                        scope.category.name = newName;
                        scope.category.edit({
                            _id: scope.category._id,
                            name: scope.category.name
                        });
                    },
                    close: function () {
                        scope.toggleEditCategory();
                    },
                    text: "Change category name",
                    textAccept: "Save",
                    type: 'prompt',
                    value: scope.category.name
                };
                scope.$watch('category.name', function () {
                    scope.actionEditCategory.value = scope.category.name;
                });
                scope.isShowDeleteCategory = false;
                scope.isShowEditCategory = false;

                scope.toggleEditCategory = function (event) {
                    if(event) event.stopPropagation();
                    scope.isShowEditCategory = !scope.isShowEditCategory;
                };
                scope.toggleDeleteCategory = function (event) {
                    if(event) event.stopPropagation();
                    scope.isShowDeleteCategory = !scope.isShowDeleteCategory;
                };

                scope.getFeedDeleteConfig = function (feed) {
                    return {
                        text: "Do you really want to delete " + feed.name,
                        textAccept: "Delete feed",
                        close: function () {
                            scope.toggleDeleteFeed(feed);
                        },
                        accept: function () {
                            scope.deleteFeed(feed);
                        },
                        type: 'confirm'
                    }
                };

                scope.getFeedEditConfig = function (feed) {
                    return {
                        text: "Edit " + feed.name + " feed",
                        textAccept: "Save",
                        close: function () {
                            scope.toggleEditFeed(feed);
                        },
                        accept: function (newName) {
                            feed.name = newName;
                            rssFeedResource.changeName(feed.feedId, feed.name);
                        },
                        value: feed.name,
                        type: 'prompt'
                    }
                };

                scope.toggleDeleteFeed = function (feed) {
                    feed.showDeleteFeed = !feed.showDeleteFeed;
                };
                scope.toggleEditFeed = function (feed) {
                    feed.showEditPanel = !feed.showEditPanel;
                };



                scope.deleteCategory = function () {
                    scope.category.remove().then(function () {
                        categoryApi.deleteCategory(scope.category._id);
                    });
                };
                scope.deleteFeed = function (feed) {
                    rssFeedResource.removeById(feed._id).then(function () {
                        scope.category.feeds = _.without(scope.category.feeds, _.findWhere(scope.category.feeds, {_id: feed._id}));
                    });
                };
            }
        });
    });
})();
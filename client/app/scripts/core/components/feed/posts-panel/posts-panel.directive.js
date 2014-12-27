(function(){
    'use strict';
    angular.module('rss.core.components.feed.posts-panel').directive('rssPostsPanel', function (rssWebComponent) {
        return rssWebComponent.RssUiComponentClass({

            restrict: "E",

            link: function (scope) {
                var config = scope.rssConfiguration.getConfiguration();
                var source = config.source;
                var countPost = angular.copy(config.options.count);
                scope.open = false;

                scope.settings = config.settings;
                scope.posts = [];
                scope.isShowMoreBtn = true;

                var options = config.options;
                scope.getNextPosts = function(){
                    source.getPosts(options).then(function (posts) {
                        posts = posts.plain();
                        if(!posts.length){
                            scope.isShowMoreBtn = false;
                        }
                        scope.posts = scope.posts.concat(posts);
                        options.from += countPost;
                    }, function () {
                        alert('Cannot get posts');
                    });
                }

                scope.getNextPosts();

            },

            templateUrl: "app/scripts/core/components/feed/posts-panel/posts-panel.directive.view.html"
        });
    });
})();
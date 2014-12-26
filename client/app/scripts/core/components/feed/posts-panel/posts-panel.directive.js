(function(){
    'use strict';
    angular.module('rss.core.components.feed.posts-panel').directive('rssPostsPanel', function (rssWebComponent) {
        return rssWebComponent.RssUiComponentClass({

            restrict: "E",

            link: function (scope) {
                var config = scope.rssConfiguration.getConfiguration();
                var source = config.source;
                var countPost = angular.copy(config.options.count);

                scope.settings = config.settings;
                scope.posts = [];

                var options = config.options;
                function getNextPosts(){
                    source.getPosts(options).then(function (posts) {
                        scope.posts = posts;
                        options.from += countPost;
                    }, function () {
                        alert('Cannot get posts');
                    });
                }

                getNextPosts();

            },

            templateUrl: "app/scripts/core/components/feed/posts-panel/posts-panel.directive.view.html"
        });
    });
})();
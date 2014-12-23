(function(){
    'use strict';
    angular.module('rss.core.components.feed.posts-panel').directive('rssPostsPanel', function (rssWebComponent) {
        return rssWebComponent.RssUiComponentClass({

            restrict: "E",

            link: function (scope) {
                var config = scope.rssConfiguration.getConfiguration();
                var source = config.source;
                var user = config.settings.user;
                var settings = config.settings;

                scope.settings = settings;
                scope.user = user;
                scope.posts = source.posts;


            },

            templateUrl: "app/scripts/core/components/feed/posts-panel/posts-panel.directive.view.html"

        });
    });
})();
(function(){
    'use strict';
    angular.module('rss.core.components.feed.feeds-panel').directive('rssFeedsPanel', function (rssWebComponent) {
        return rssWebComponent.RssUiComponentClass({

            restrict: "E",

            link: function () {},

            templateUrl: "app/scripts/core/components/feed/feeds-panel/feeds-panel.directive.view.html"

        });
    });
})();
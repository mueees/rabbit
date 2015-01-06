(function(){
    'use strict';

    angular.module('rss.core.components.time-left').directive('rssSignBar', function (rssAuthentication, rssWebComponent) {

        return rssWebComponent.RssUiComponentClass({
            restrict: "E",
            templateUrl: "app/scripts/core/components/time-left/time-left.directive.view.html",

            link: function (scope, element, attrs, controllers) {

                var config = scope.rssConfiguration.getConfiguration();

                config.pubdae

            }
        });
    });

})();
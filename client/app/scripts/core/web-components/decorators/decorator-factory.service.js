(function () {
    'use strict';
    angular.module('rss.core.web-components')
        .factory('RssDecoratorFactory', function (RssStateDecorator) {
            return {
                RssStateDecorator: RssStateDecorator
            };
        });
})();
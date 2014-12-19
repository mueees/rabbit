(function () {
    'use strict';
    angular.module('rss', [
        'templates-app',
        'ui.router',

        'rss.core.error-handling',

        //debug
        'rss.core.fake-server',

        //pages
        'rss.promo',
        'rss.app'
    ]);
})();
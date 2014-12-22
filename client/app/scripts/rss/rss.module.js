(function () {
    'use strict';
    angular.module('rss', [
        'templates-app',
        'ui.router',
        'ngAnimate',
        'rss.core.error-handling',

        //debug
        'rss.core.fake-server',

        //pages
        'rss.promo',
        'rss.app'
    ]);
})();
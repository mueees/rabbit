(function () {
    'use strict';
    angular.module('rss', [
        'templates-app',
        'ui.router',

        'rss.core.error-handling',

        //pages
        'rss.promo',
        'rss.app'
    ]);
})();
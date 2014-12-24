var rss = rss || {};
(function () {
    'use strict';

    var inject = [
        'templates-app',
        'ui.router',
        'ngAnimate',
        'rss.core.error-handling',

        //pages
        'rss.promo',
        'rss.app'
    ];
    if(rss.fakeServer){
        inject.push('rss.core.fake-server');
    }

    angular.module('rss', inject);
})();
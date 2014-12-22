(function () {
    'use strict';
    angular.module('rss').config(function ($httpProvider, $urlRouterProvider, rssAuthenticationProvider) {
        $httpProvider.interceptors.push("rssHttpResponseErrorInterceptor");

        rssAuthenticationProvider.loginState('main.app.index.feed');
        rssAuthenticationProvider.appState('main.app.index.feed');

        $urlRouterProvider.otherwise("/main/app/index/feed/123");

    });
})();
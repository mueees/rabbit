(function () {
    'use strict';
    angular.module('rss').config(function ($httpProvider, $urlRouterProvider, rssAuthenticationProvider, growlProvider) {
        $httpProvider.interceptors.push("rssHttpResponseErrorInterceptor");

        rssAuthenticationProvider.loginState('main.app.index.feed');
        rssAuthenticationProvider.appState('main.app.index.feed');

        growlProvider.globalTimeToLive(10000);

        $urlRouterProvider.otherwise("/main/app/index/home");

    });
})();
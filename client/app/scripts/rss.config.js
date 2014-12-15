(function () {
    'use strict';
    angular.module('rss').config(function ($httpProvider, rssAuthenticationProvider) {
        $httpProvider.interceptors.push("rssHttpResponseErrorInterceptor");

        rssAuthenticationProvider.loginState('main.app.index.feed');
        rssAuthenticationProvider.appState('main.app.index.feed');
    });
})();
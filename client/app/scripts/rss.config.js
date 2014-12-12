(function () {
    'use strict';
    angular.module('rss').config(function ($httpProvider) {
        $httpProvider.interceptors.push("rssHttpResponseErrorInterceptor");
    });
})();
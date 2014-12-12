(function () {
    'use strict';
    angular.module('rss.core.error-handling').factory('rssHttpResponseErrorInterceptor', function ($q, rssServerErrorHandler) {
        return {
            responseError: function (response) {
                rssServerErrorHandler.handleServerResponseError(response);
                return $q.reject(response);
            }
        };
    });
})();
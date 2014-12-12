(function () {
    'use strict';
    angular.module('rss.core.error-handling').constant('RSS_ERROR_MESSAGES', {
        httpDefaultError: 'An unexpected server communication error has occurred. Status: %s.',
        httpNetworkError: 'Network communication error has occurred.',
        scriptError: 'An unexpected script error has occurred.'
    });
})();
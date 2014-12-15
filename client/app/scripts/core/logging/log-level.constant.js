(function () {
    'use strict';
    angular.module('rss.core.logging').constant('RSS_LOG_LEVEL', {
        debug: 'log-level-debug',
        info: 'log-level-info',
        warn: 'log-level-warning',
        error: 'log-level-error',
        all: 'log-level-all'
    });
})();
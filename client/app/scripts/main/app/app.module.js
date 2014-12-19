(function () {
    'use strict';

    angular.module('rss.app', [
        'ui.router',
        'rss.viewport',
        'rss.core.security',

        'rss.core.components.sign-bar'
    ]);

})();
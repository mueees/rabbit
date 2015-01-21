(function () {
    'use strict';

    angular.module('rss.app', [
        'ui.router',
        'rss.viewport',
        'rss.core.security',
        'rss.core.resources',

        'rss.core.components.sign-bar',
        'rss.core.components.categories-bar',
        'rss.core.components.search-bar',

        'rss.app.feed',
        'rss.app.organize'
    ]);

})();
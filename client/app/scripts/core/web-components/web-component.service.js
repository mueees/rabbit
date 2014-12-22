(function () {
    'use strict';
    angular.module('rss.core.web-components')
        .factory('rssWebComponent', function (RssUiComponentClass) {
            return {
                RssUiComponentClass: function (configuration) {
                    rss.assert.assertObject(configuration);
                    return new RssUiComponentClass(configuration);
                }
            };
        });
})();
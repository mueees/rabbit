(function () {
    'use strict';

    angular.module('rss.core.resources').factory('rssResource', function (Restangular, RSS_RESOURCE_URLS) {
        /**
         * Map of url string to filter handler functions and is used globally
         * @type {Object}
         */
        var filterHandlers = {};

        /**
         * Builds a url by joining multiple items together and strips duplicate slashes
         * @param var_args
         * @returns {string}
         */
        var buildUrl = function (var_args) {
            var url = Array.prototype.slice.call(arguments, 0);
            rss.assert.assertArrayWithLength(url);

            return url.join('/').replace('//', '/');
        };

        /**
         * Creates a Restangular instance with the specified base url that is different from the one defined in
         * RX_RESOURCE_URLS.applicationApi.
         *
         * You can also call withConfig if you want to create a new instance with the same URL but modify the core
         * settings, such as default parameters.
         *
         * @param {!string} url The new URL to use for the REST calls and can be another domain
         * @param {?Function=} opt_configurerFn RestangularConfigurer method and here it is optional
         * @returns {!Object}
         */
        var withUrlConfigurationFunction = function (url, opt_configurerFn) {

            rss.assert.assertStringWithLength(url);
            rss.assert.assert(rss.util.isNullOrUndefined(opt_configurerFn) || rss.util.isFunction(opt_configurerFn));

            var newInstance = this.withConfig(function (RestangularConfigurer) {
                if (rss.util.isFunction(opt_configurerFn)) {
                    opt_configurerFn(RestangularConfigurer);
                }
                RestangularConfigurer.setBaseUrl(url);
            });

            // Decorate the Restangular instance with our own required methods
            newInstance.withUrlConfiguration = _.bind(withUrlConfigurationFunction, newInstance);
            return newInstance;
        };

        return withUrlConfigurationFunction.call(Restangular, RSS_RESOURCE_URLS.applicationApi, function (RestangularConfigurer) {

            // Response interceptor that handles all our filtering.
            RestangularConfigurer.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
                // Only run this for getList and where there are matching filters
                if (operation === 'getList' && rss.util.isArrayWithLength(filterHandlers[url])) {
                    var filteredData = [];
                    // Filter out and keep ids with an even number
                    rss.util.forEach(data, function (item) {
                        var addItem = true;
                        rss.util.forEach(filterHandlers[url], function (handlerFn) {
                            if (addItem && !handlerFn(item)) {
                                addItem = false;
                            }
                        });
                        if (addItem) {
                            filteredData.push(item);
                        }
                    });

                    return filteredData;
                }

                return data;
            });

        });
    });

})();
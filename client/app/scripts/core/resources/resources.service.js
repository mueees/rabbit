(function () {
    'use strict';

    angular.module('rss.core.resources').factory('rssResource', function (Restangular, RSS_RESOURCE_URLS, rssSession) {

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

            //Always send user token if it exist
            newInstance.setDefaultRequestParams('get', {token: rssSession.getToken()});

            return newInstance;
        };

        return withUrlConfigurationFunction.call(Restangular, RSS_RESOURCE_URLS.applicationApi, function (RestangularConfigurer) {});
    });

})();
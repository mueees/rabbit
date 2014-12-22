(function () {
    'use strict';
    angular.module('rss.core.web-components')
        .factory('RssUiComponentClass', function (RssDecoratorFactory) {

            function CoreUIDirective(configuration){

                this.scope = {};

                this.restrict = 'E';

                this.scope = rss.util.extend(this.scope, {
                    __rssConfiguration: '=rssConfiguration'
                });

                if (configuration.templateUrl) {
                    this.templateUrl = configuration.templateUrl;
                } else if (rss.util.isStringWithLength(configuration.template)) {
                    this.template = configuration.template;
                }

                var _linkFn = function (scope, element, attrs, controllers) {
                    scope.rssConfiguration = {
                        /**
                         * Returns the current configuration
                         * @returns {string|!Object}
                         */
                        getConfiguration: function () {
                            return scope.__rssConfiguration;
                        },

                        /**
                         * Sets the configuration to the specified item
                         * @param {!Object} configuration
                         */
                        setConfiguration: function (configuration) {
                            rss.assert.assertObject(configuration);
                            scope.__rssConfiguration = configuration;
                        }
                    };

                    if(configuration.scopeDecorators){
                        angular.forEach(configuration.scopeDecorators, function (Decorator) {
                            var decorator = new RssDecoratorFactory[Decorator]();
                            decorator.decorateScope(scope, element, attrs, controllers)
                        });
                    }

                    ////////////////////////////////////////////////
                    // Call the developer defined link function/////
                    ////////////////////////////////////////////////
                    if (rss.util.isFunction(configuration.link)) {
                        configuration.link(scope, element, attrs, controllers);
                    }
                };

                this.compile = function (element, attributes) {
                    return _linkFn;
                };

            }

            return CoreUIDirective;
        });
})();
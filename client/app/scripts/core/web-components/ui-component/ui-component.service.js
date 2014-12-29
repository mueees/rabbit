(function () {
    'use strict';
    angular.module('rss.core.web-components')
        .factory('RssUiComponentClass', function (RssDecoratorFactory, rssUiComponentConfiguration, RssStateDecorator) {

            function CoreUIDirective(configuration){

                /**
                 * * All the core state options for the UI component
                 * @type {Array.<Object>}
                 */
                var _stateOptions = (configuration.optStateOptions && configuration.optStateOptions.length) ? configuration.optStateOptions : [];
                _stateOptions = _stateOptions.concat(rssUiComponentConfiguration.getState());
                var _rssStateDecorator = new RssStateDecorator(_stateOptions);

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

                    /**
                     * Adds the specified class name to the bounding element
                     * @param {!string} name
                     */
                    scope.rssAddClass = function (name) {
                        rss.assert.assertStringWithLength(name);
                        element.addClass(name);
                    };

                    /**
                     * Removes the specified class name from the bounding element
                     * @param {!string} name
                     */
                    scope.rssRemoveClass = function (name) {
                        rss.assert.assertStringWithLength(name);
                        element.removeClass(name);
                    };

                    /*Apply all decorators*/
                    if(configuration.scopeDecorators){
                        angular.forEach(configuration.scopeDecorators, function (Decorator) {
                            if(RssDecoratorFactory[Decorator]){
                                var decorator = new RssDecoratorFactory[Decorator]();
                                decorator.decorateScope(scope, element, attrs, controllers)
                            }
                        });
                    }

                    _rssStateDecorator.decorateScope(scope, element, attrs, controllers);

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
(function () {
    'use strict';
    angular.module('rss.core.web-components')
        .factory('RssUiComponentClass', function (RssDecoratorFactory, rssUiComponentConfiguration, RssStateDecorator, $q) {

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

                    scope.rssBusyIndicator = {
                        promise: null,
                        templateUrl: 'app/scripts/core/components/regular-busy/regular-busy.view.html'
                    };

                    var _busyVisualEngine = {
                        /**
                         * A promise created internally if one is not supplied to the busy
                         */
                        deferred: null,

                        /**
                         * Determines if it the busy signal has been activated
                         */
                        started: false,

                        /**
                         * Called to initiate the busy icon
                         * @param {?$promise=} optPromise Optional Angular promise that could be the result of a Rest
                         * Call or specify null to use default behaviour
                         */
                        startBusy: function (optPromise) {
                            if (!_busyVisualEngine.started) {
                                _busyVisualEngine.started = true;
                                _busyVisualEngine.deferred = !rss.util.isObject(optPromise) ? $q.defer() : null;
                                optPromise = optPromise || _busyVisualEngine.deferred.promise;
                                scope.rssBusyIndicator.promise = optPromise;
                                optPromise.finally(function () {
                                    scope.rssBusyIndicator.promise = null;
                                    _busyVisualEngine.started = false;
                                    _busyVisualEngine.deferred = null;
                                });
                            }
                        },

                        /**
                         * Called to remove the busy indicator
                         */
                        endBusy: function () {
                            if (_busyVisualEngine.started && _busyVisualEngine.deferred) {
                                // We created the promise so we can stop it
                                _busyVisualEngine.deferred.resolve();
                            }
                        },

                        /**
                         * Returns true if the busy indicator is currently active.
                         * @returns {boolean}
                         */
                        isActive: function () {
                            return _busyVisualEngine.started;
                        }
                    };

                    scope.$watch('rssBusy', function (busy) {
                        if (busy) {
                            _busyVisualEngine.startBusy();
                        } else {
                            _busyVisualEngine.endBusy();
                        }
                    }, true);

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
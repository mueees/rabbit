(function () {
    'use strict';
    angular.module('rss.core.web-components')
        .factory('RssStateEngine', function ($q) {

            function StateConfiguration(fullyQualifiedName, abstract, optClassName, optHandlerFn, optResolveFn, optData){
                rss.assert.assertStringWithLength(fullyQualifiedName);

                /**
                 * The fully qualified name of the state and using dot notation creates a hierarchical structure
                 * @type {!string}
                 * @private
                 */
                var _fullyQualifiedName = fullyQualifiedName;

                /**
                 * Resolve Function that is called when the state is activated or deactivate to determine if the state change is allowed
                 * @type {!Array.<Function>} Resolve functions called with (state.name, activated, scope, data) and returns false to block the change or true to allow it
                 * @private
                 */
                var _resolveFn = rss.util.isArray(optResolveFn) ? optResolveFn : rss.util.isFunction(optResolveFn) ? [optResolveFn] : [];

                /**
                 * Data that can be configured by the developer
                 * @type {!Object}
                 * @private
                 */
                var _data = optData;
                /**
                 * Handler Function that is called when the state is activated or deactivate and allows the developer to define code to decorate the scope in addition to the class
                 * been added or removed
                 * @type {!Array.<Function>} Resolve functions called with (state.name, activated, scope, data) and returns false to block the change or true to allow it
                 * @private
                 */
                var _handlerFn = rss.util.isArray(optHandlerFn) ? optHandlerFn : rss.util.isFunction(optHandlerFn) ? [optHandlerFn] : [];
                /**
                 * Class name to assign when the state becomes active
                 * @type {?string}
                 * @private
                 */
                var _className = rss.util.isStringWithLength(optClassName) ? optClassName : 'rss-' + fullyQualifiedName.toLowerCase().split('.').join('-');

                /**
                 * Sets the specified state active/de-active for the scope.
                 * @param scope
                 * @param active
                 * @private
                 */
                var _setActive = function (scope, active) {
                    rss.assert.assertScope(scope);
                    scope.rssActiveStateMap = scope.rssActiveStateMap || {};
                    scope.rssActiveStateMap[_fullyQualifiedName] = active;
                };

                /**
                 * Called internally when a state has successfully been activated or deactivated
                 * @param {!boolean} activate
                 * @param {!$scope} scope
                 * @private
                 */
                var _executeHandlers = function (activate, scope) {
                    if (rss.util.isArrayWithLength(_handlerFn)) {
                        rss.util.forEach(_handlerFn, function (handlerFn) {
                            if (rss.util.isFunction(handlerFn)) {
                                // Protected the code from bad handlers
                                try {
                                    handlerFn(_fullyQualifiedName, activate, scope, _data);
                                } catch (e) {
                                    alert('Bad State Execution handler detected for state');
                                }
                            }
                        });
                    }
                };

                /**
                 * Returns the fully qualified state name
                 * @returns {!string}
                 */
                this.getFullyQualifiedName = function () {
                    return _fullyQualifiedName;
                };

                /**
                 * Returns true if this state is active
                 * @param scope
                 * @returns {boolean|*}
                 */
                this.isActive = function (scope) {
                    rss.assert.assertScope(scope);
                    scope.rssActiveStateMap = scope.rssActiveStateMap || {};
                    return rss.util.isBoolean(scope.rssActiveStateMap[_fullyQualifiedName]) && scope.rssActiveStateMap[_fullyQualifiedName];
                };

                /**
                 * Called internally to execute the Resolve if defined when a state change occurs
                 * @param {!boolean} activate Is the state been activated (true) or de-activated (false)
                 * @param {!$scope} scope
                 * @returns {!promise}
                 */
                this.executeResolve = function (activate, scope) {
                    var deferred = $q.defer();
                    if (rss.util.isArrayWithLength(_resolveFn)) {
                        var promises = [];
                        rss.util.forEach(_resolveFn, function (resolveFn) {
                            if (rss.util.isFunction(resolveFn)) {
                                try {
                                    promises.push($q.when(resolveFn(_fullyQualifiedName, activate, scope, _data)));
                                } catch (e) {
                                    alert('Error occurred when calling resolve function for state ');
                                }
                            }
                        });
                        if (promises.length) {
                            $q.all(promises).then(function () {
                                deferred.resolve();
                            }, function (error) {
                                deferred.reject(error);
                            });
                        } else {
                            deferred.resolve();
                        }
                    } else {
                        deferred.resolve();
                    }

                    deferred.promise.then(function () {
                        // It was allowed so we should run the handlers
                        _executeHandlers(activate, scope);
                    });

                    return deferred.promise;
                };

                /**
                 * Activates the current state
                 * @param {!scope} scope
                 */
                this.activateState = function (scope) {
                    if(!this.isActive(scope)) {
                        scope.rssAddClass(_className);
                        _setActive(scope, true);
                    }
                };

                /**
                 * Deactivates the current state
                 * @param {!$scope} scope
                 */
                this.deactivateState = function (scope) {
                    if (this.isActive(scope)) {
                        scope.rssRemoveClass(_className);
                        _setActive(scope, false);
                    }
                };

            }

            function RssStateEngine(onStateTransitionFn){

                var _stateConfigurations = {};

                /**
                 * Stores the state configuration in the internal map
                 * @param configuration
                 * @private
                 */
                function _storeState(configuration){
                    rss.assert.assertInstanceof(configuration, StateConfiguration);
                    var fullyQualifiedName = configuration.getFullyQualifiedName();
                    rss.assert.assertStringWithLength(fullyQualifiedName);
                    _stateConfigurations[fullyQualifiedName] = configuration;
                }

                /**
                 * Activate the specified state
                 * @param state
                 * @param scope
                 * @param oldStateName
                 * @private
                 */
                var _activateState = function (state, scope, oldStateName) {
                    state.activateState(scope);
                    onStateTransitionFn(scope, state.getFullyQualifiedName(), oldStateName);
                };

                /**
                 * Deactivate the specified active state and also updates all the parents
                 * @param {!StateConfiguration} configuration
                 * @param {!$scope} scope
                 * @private
                 */
                var _deactivateState = function (state, scope) {
                    state.deactivateState(scope);
                };

                /**
                 * Searches for an active state that does not match the specified ignoreName and only searches states associate with the parent name down the hierarchy
                 * @param {$scope} scope
                 * @param {!string} parentName
                 * @param {!string} ignoreName
                 * @returns {StateConfiguration|null}
                 * @private
                 */
                /*var _getActiveState = function (scope, parentName, ignoreName) {
                    rx.assert.assertStringWithLength(parentName);
                    rx.assert.assertStringWithLength(ignoreName);

                    var activeState = null;
                    rx.util.forEach(_stateChildren[parentName], function (childState) {
                        if (!activeState && childState && childState.isActive(scope) && !childState.isAbstract() && childState.getFullyQualifiedName() !== ignoreName) {
                            activeState = childState;
                        } else if (childState.isAbstract()) {
                            activeState = _getActiveState(scope, childState.getFullyQualifiedName(), ignoreName);
                        }
                    });

                    return activeState;
                };*/


                this.state = function (fullyQualifiedName, optAbstract, optClassName, optHandlerFn, optResolveFn, optData) {
                    if (rss.util.isObject(fullyQualifiedName)) {
                        var tempObj = fullyQualifiedName;
                        fullyQualifiedName = tempObj.name;
                        optClassName = tempObj.className;
                        optAbstract = tempObj.abstract;
                        optData = tempObj.data;
                        optResolveFn = tempObj.resolve;
                        optHandlerFn = tempObj.handler;
                    }

                    _storeState(new StateConfiguration(fullyQualifiedName, optAbstract, optClassName, optHandlerFn, optResolveFn, optData));
                };

                this.transitionTo = function (stateName, scope) {
                    rss.assert.assertScope(scope);
                    rss.assert.assertFunction(scope.rssAddClass);
                    rss.assert.assertFunction(scope.rssRemoveClass);
                    rss.assert.assertStringWithLength(stateName);

                    scope.rssActiveStateMap = scope.rssActiveStateMap || {};

                    var newState = _stateConfigurations[stateName];

                    rss.assert.assertObject(newState, 'There is no state defined for \'%s\'.', stateName);
                    if (!newState.isActive(scope)) {
                        debugger;
                        //var activeState = _getActiveState(scope, newState.getRootParent(), newState.getFullyQualifiedName());

                        var promises = [];
                        promises.push(newState.executeResolve(true, scope));

                        // Both deactivate and activate must be allowed
                        var deferred = $q.defer();

                        $q.all(promises).then(function () {
                            debugger;
                            console.log('State transition allowed.');
                            // Both allowed the transition so now we can disable the current active state if any then activate the new state
                            var oldStateName = null;
                            /*if (activeState) {
                                _deactivateState(activeState, scope);
                                oldStateName = activeState.getFullyQualifiedName();
                            }*/
                            _activateState(newState, scope, oldStateName);
                            deferred.resolve();
                        }, function () {
                            deferred.reject('State transition blocked.');
                        });

                        return deferred.promise;
                    }
                }

            }

            return RssStateEngine;

        });
})();
(function () {
    'use strict';
    angular.module('rss.core.web-components')
        .factory('RssStateDecorator', function (RssStateEngine) {
            function Decorator(_stateOptions){

                var _rssStateEngine = new RssStateEngine(function (scope, newState, oldState) {
                    if (rss.util.isScope(scope) && rss.util.isStringWithLength(newState)) {
                        if (rss.util.isFunction(scope.rssOnStateChanged)) {
                            scope.rssOnStateChanged(newState, oldState);
                        }
                    }
                });

                rss.util.forEach(_stateOptions, function (option) {
                    _rssStateEngine.state(option);
                });

                this.decorateScope = function(scope, element, attrs, controllers){

                    rss.assert.assertScope(scope);

                    /**
                     * Called when the state changes and can be used by the component to execute additional actions
                     * @param {!$scope} scope
                     * @param {!string} newState
                     * @param {!string} oldState
                     */
                    scope.rssOnStateChanged = rss.util.noop;

                    scope.rssStateEngine = {
                        transitionTo: function (stateName) {
                            _rssStateEngine.transitionTo(stateName, scope);
                        }
                    }
                }
            }
            return Decorator;
        });
})();
/**
 * @ngdoc service
 * @name rssAuthentication
 *
 * @description
 * The rssAuthentication provide api for login and logout
 * And handle each request, for checking access
 */
(function () {
    'use strict';
    angular.module('rss.core.security').provider( 'rssAuthentication', function () {
        var _loginState = null,
            _appState = null;

        function loginState(stateName, stateParams) {
            if (arguments.length) {
                rss.assert.assertStringWithLength(stateName, 'Invalid login state name.');

                _loginState = {
                    name: stateName,
                    params: stateParams
                };
            }

            return _loginState;
        }

        function appState(stateName, stateParams) {
            if (arguments.length) {
                if (rss.util.isStringWithLength(stateName)) {
                    _appState = {
                        name: stateName,
                        params: stateParams
                    };
                } else if (rss.util.isFunction(stateName)) {
                    _appState = stateName;
                } else if (rss.util.isObject(stateName) && rss.util.isStringWithLength(stateName.name)) {
                    _appState = stateName;
                } else {
                    rss.assert.fail("Invalid appState.");
                }
            }

            return _appState;
        }

        return {
            loginState: loginState,
            appState: appState,

            $get: function ($rootScope, $state, $localStorage, rssAuthUserResource, rssSession, RSS_AUTH_EVENTS) {

                if (!_loginState || !_loginState.name || !_appState) {
                    throw new Error('rssAuthentication service has not been configured properly.');
                }

                var afterLoginState = _appState;

                function login(credentials){
                    return rssAuthUserResource.login(credentials).then(function (token) {
                        rssSession.create({
                            token: token
                        });
                    });
                }
                function logout(){
                    return rssAuthUserResource.logout().then(function () {
                        rssSession.destroy();
                    });
                }

                function _redirectToTargetState(){
                    var targetState = afterLoginState;

                    if (rss.util.isFunction(targetState)) {
                        targetState = targetState();
                    }

                    if (rss.util.isString(targetState)) {
                        targetState = {
                            name: targetState
                        };
                    }

                    $state.go(targetState.name, targetState.params);
                    afterLoginState = _appState;
                }

                $rootScope.$on(RSS_AUTH_EVENTS.notAuthenticated, function (event, toState, toParams) {
                    if (toState) {
                        afterLoginState = {
                            name: toState.name,
                            params: toParams
                        };
                    }

                    $state.go(_loginState.name, _loginState.params);
                });

                $rootScope.$on(RSS_AUTH_EVENTS.loginSuccess, _redirectToTargetState);

                $rootScope.$on(RSS_AUTH_EVENTS.logoutSuccess, function () {
                    afterLoginState = _appState;
                    $state.go(_loginState.name, _loginState.params);
                });

                $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
                    if (toState.access && toState.access.loginRequired === false) {
                        return;
                    }

                    if (!rssSession.isAuthenticated()) {
                        event.preventDefault();
                        $rootScope.$broadcast(RSS_AUTH_EVENTS.notAuthenticated, toState, toParams);
                    }
                });

                return {
                    login: login,
                    logout: logout
                };

            }
        }
    });
})();
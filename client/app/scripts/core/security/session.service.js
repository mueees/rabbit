/**
 * @ngdoc service
 * @name rssSession
 *
 * @description
 * The rssSession service provide information about current user
 */

(function () {
    'use strict';
    angular.module('rss.core.security').factory('rssSession', function ($localStorage, $rootScope) {
        var _user = null;

        function _create(user) {
            _user = user;
            $localStorage.user = user;
            $rootScope.user = user;
        }

        function _destroy() {
            _user = null;
            $localStorage.user = null;
            $rootScope.user = null;
        }

        function _getUser() {
            return _user;
        }

        function _getToken(){
            if(rss.util.isStringWithLength(_user.token)){
                return _user.token
            }else{
                return false;
            }
        }

        function _isAuthenticated(){
            return !rss.util.isNull(_user) && rss.util.isStringWithLength(_user.token);
        }

        function initUser(){
            _user = $localStorage.user;
        }

        initUser();

        return {
            create: _create,
            getToken: _getToken,
            destroy: _destroy,
            getUser: _getUser,
            isAuthenticated: _isAuthenticated
        };
    });
})();
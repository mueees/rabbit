(function () {
    'use strict';
    angular.module('rss.core.security').factory('rssSession', function () {
        var _username = null;

        function _create(username) {
            _username = username;
        }

        function _destroy() {
            _username = null;
        }

        function _getUsername() {
            return _username;
        }

        return {
            create: _create,
            destroy: _destroy,
            getUsername: _getUsername
        };
    });
})();
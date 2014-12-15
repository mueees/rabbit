(function(){
    'use strict';

    angular.module('rss.core.components.sign-bar').directive('signBar', function (rssAuthentication) {
        return {
            restrict: "E",
            templateUrl: "app/scripts/core/components/sign-bar/sign-bar.directive.view.html",
            scope: {},
            link: function (scope) {
                scope.user = {};

                scope.signIn = function () {};
                scope.signUp = function () {
                    rssAuthentication.login({
                        email: "test@email.com",
                        password: "testpassword"
                    });
                };
            }
        }
    });

})();
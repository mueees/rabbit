(function(){
    'use strict';

    angular.module('rss.core.components.sign-bar').directive('signBar', function (rssAuthentication) {
        return {
            restrict: "E",
            templateUrl: "app/scripts/core/components/sign-bar/sign-bar.directive.view.html",
            scope: {},
            link: function (scope) {

                scope.user = {};

                scope.signIn = function () {
                    rssAuthentication.signin({
                        email: scope.user.email,
                        password: scope.user.password
                    });
                };

                scope.signUp = function () {
                    rssAuthentication.signup({
                        email: scope.user.email,
                        password: scope.user.password
                    });
                };

            }
        }
    });

})();
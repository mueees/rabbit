(function(){
    'use strict';

    angular.module('rss.core.components.sign-bar').directive('rssSignBar', function (rssAuthentication, rssWebComponent) {

        return rssWebComponent.RssUiComponentClass({
            restrict: "E",
            templateUrl: "app/scripts/core/components/sign-bar/sign-bar.directive.view.html",

            scopeDecorators: [
                'RssStateDecorator'
            ],

            link: function (scope, element, attrs, controllers) {

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
        });
    });

})();
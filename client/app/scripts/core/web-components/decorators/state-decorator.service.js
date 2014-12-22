(function () {
    'use strict';
    angular.module('rss.core.web-components')
        .factory('RssStateDecorator', function () {
            function Decorator(){

                this.decorateScope = function(scope, element, attrs, controllers){
                    rss.assert.assertScope(scope);
                }
            }
            return Decorator;
        });
})();
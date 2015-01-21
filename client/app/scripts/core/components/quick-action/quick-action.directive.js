(function(){
    'use strict';

    angular.module('rss.core.components.quick-action').directive('rssQuickAction', function ($document) {

        return {

            restrict: "A",

            link: function (scope, element, attrs, controllers) {
                element.addClass('rss-quick-action');

                scope.quick = {
                    isShowActionDialog: false
                };

                scope.quick.showQuickDialog = function (event) {
                    event.stopPropagation();
                    scope.quick.isShowActionDialog = !scope.quick.isShowActionDialog;
                };
                scope.quick.isShowDialog = function () {
                    return scope.quick.isShowActionDialog;
                };

                scope.quick.close = function () {
                    scope.quick.isShowActionDialog = false;
                };

                element.on('click', function (event) {
                    event.stopPropagation();
                });

                $document.on("click", function(event) {
                        scope.quick.close();
                        scope.$digest();
                    }
                );
            }
        };
    });

})();
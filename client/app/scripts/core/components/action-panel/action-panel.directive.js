(function () {
    'use strict';

    angular.module('rss.core.components.action-panel').directive('rssActionPanel', function () {

        return {
            restrict: "E",
            templateUrl: "app/scripts/core/components/action-panel/action-panel.directive.view.html",
            scope: {
                rssConfiguration: "&"
            },
            link: function (scope) {
                var defauls = {
                    textAccept: "Ok",
                    textCancel: "Cancel",
                    text: "This is just default text"
                };

                var config = scope.rssConfiguration();

                config = angular.extend(defauls, config);

                var acceptOld = config.accept;

                config.accept = function () {
                    acceptOld();
                    config.close();
                };

                scope.data = config;

                /*

                 element.on('click', function (event) {
                 event.stopPropagation();
                 });

                var onClick = function() {
                    scope.$apply(function() {
                        scope.data.close();
                    });
                };

                $document.on('click', onClick);

                scope.$on('$destroy', function() {
                    $document.off('click', onClick);
                });*/
            }
        };
    });

})();
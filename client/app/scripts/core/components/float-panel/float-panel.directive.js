(function(){
    'use strict';
    angular.module('rss.core.components.float-panel').directive('rssFloatPanel', function (rssWebComponent) {
        return rssWebComponent.RssUiComponentClass({

            restrict: "E",

            replace: true,

            templateUrl: "app/scripts/core/components/float-panel/float-panel.directive.view.html",

            link: function (scope) {

                var defaultConfig = {
                    panelConfig: {
                        side: 'right'
                    }
                };

                scope.config =  scope.rssConfiguration.getConfiguration();

                angular.extend(scope.config, defaultConfig);

                scope.close = function () {
                    scope.config.data.manage.overlay = false;
                    scope.config.data.manage.open = false;
                    scope.config.data.include.url = '';
                    scope.config.data.include.data = {};
                }
            }
        });
    });
})();
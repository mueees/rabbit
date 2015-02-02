(function () {
    'use strict';

    angular.module('rss.core.components.action-panel').directive('rssActionPanel', function () {

        return {
            restrict: "E",
            template: '<div ng-include="getContentUrl()"></div>',
            scope: {
                rssConfiguration: "&"
            },
            link: function (scope, element) {
                var supportedType = ['confirm','prompt'];
                var config = scope.rssConfiguration();




                switch (config.type){
                    case 'confirm':
                        _initializeConfirm();
                        break;
                    case 'prompt':
                        _initializePrompt();
                        break;
                }

                function _initializePrompt(){
                    var defaults = {
                        textAccept: "Ok",
                        textCancel: "Cancel",
                        text: "This is just default text"
                    };
                    config = angular.extend(defaults, config);
                    var acceptOld = config.accept;
                    //todo: finish promt function
                }

                function _initializeConfirm(){
                    var defaults = {
                        textAccept: "Ok",
                        textCancel: "Cancel",
                        text: "This is just default text"
                    };
                    config = angular.extend(defaults, config);
                    var acceptOld = config.accept;

                    config.accept = function () {
                        if(acceptOld) acceptOld();
                        config.close();
                    };

                    scope.data = config;
                }


                scope.getContentUrl = function(){
                    rss.assert.assertArrayWithValue(supportedType, config.type);
                    return 'app/scripts/core/components/action-panel/action-panel.' + config.type + '.directive.view.html';
                };

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
(function(){
    'use strict';

    angular.module('rss.core.components.categories-bar').directive('rssCategoriesItem', function () {

        function link(scope){
            scope.isOpen = false;
            scope.categoryClick = function (event) {
                event.preventDefault();
                scope.isOpen = !scope.isOpen;
            };
        }

        return {
            restrict: "A",
            link: link
        };
    });

})();
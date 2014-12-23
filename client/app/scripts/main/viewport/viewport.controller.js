(function () {
    'use strict';
    angular.module('rss.viewport').controller('ViewportController', function ($scope, $rootScope) {
        $rootScope.__rssFloatPanelConfiguration = {
            data:{
                manage: {
                    open: false
                },
                include: {}
            }
        };
    });
})();
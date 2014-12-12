(function () {
    'use strict';

    angular.module('rss.app').config(function ($stateProvider) {
        $stateProvider
            .state('main.app', {
                url: '/app',
                templateUrl: 'app/scripts/app/app.view.html'
            });
    });

})();
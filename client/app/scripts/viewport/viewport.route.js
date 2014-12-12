(function () {
    'use strict';

    angular.module('rss.viewport').config(function ($stateProvider) {
        $stateProvider.state('main', {
            abstract: true,
            url: '/main',
            templateUrl: 'app/scripts/viewport/viewport.view.html',
            controller: 'ViewportController'
        });
    });

})();
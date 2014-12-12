(function () {
    'use strict';

    angular.module('rss.promo').config(function ($stateProvider) {
        $stateProvider
            .state('main.promo', {
                url: '/promo',
                templateUrl: 'app/scripts/promo/promo.view.html',
                controller: 'PromoController'
            });
    });

})();
(function () {
    'use strict';

    angular.module('rss.app').config(function ($stateProvider) {
        $stateProvider
            .state('main.app', {
                abstract: true,
                url: '/app',
                templateUrl: 'app/scripts/app/app.view.html',
                controller: "AppController"
            })
            .state('main.app.index', {
                abstract: true,
                url: '/index',
                views: {
                    sidebarLeft: {
                        templateUrl: "app/scripts/app/index/sidebarLeft/sidebarLeft.view.html"
                    },
                    sidebarRight: {
                        templateUrl: "app/scripts/app/index/sidebarRight/sidebarRight.view.html"
                    },
                    content: {
                        template: '<div ui-view class="col-md-10 col-centered content"></div>'
                    }
                }
            })
            .state('main.app.index.feed', {
                url: '/feed',
                templateUrl: "app/scripts/app/feed/app-feed.view.html"
            });
    });
})();
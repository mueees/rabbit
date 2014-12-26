(function () {
    'use strict';

    angular.module('rss.app').config(function ($stateProvider) {
        $stateProvider
            .state('main.app', {
                abstract: true,
                url: '/app',
                templateUrl: 'app/scripts/main/app/app.view.html',
                controller: "AppController"
            })
            .state('main.app.index', {
                abstract: true,
                url: '/index',
                views: {
                    sidebarLeft: {
                        templateUrl: "app/scripts/main/app/index/sidebarLeft.view.html"
                    },
                    sidebarRight: {
                        templateUrl: "app/scripts/main/app/index/sidebarRight.view.html"
                    },
                    content: {
                        template: '<div ui-view class="col-md-10 col-centered content"></div>'
                    }
                }
            })
            .state('main.app.index.home', {
                url: '/home',
                templateUrl: "app/scripts/main/app/home/home.view.html"
            })
            .state('main.app.index.feed', {
                url: '/feed/:id',
                templateUrl: "app/scripts/main/app/feed/app-feed.view.html",
                controller: 'FeedController',
                resolve: {
                    feed: function ($stateParams, rssFeedResource) {
                        return rssFeedResource.one($stateParams.id).get();
                    },
                    user: function (rssSession) {
                        return rssSession.getUser();
                    }
                }
            });
    });
})();
(function () {
    'use strict';

    angular.module('rss.app.feed').controller("FeedController", function ($scope, feed, user, $rootScope) {

        $scope.feed = feed;
        $scope.user = user;

        $scope.followFeed = function () {
            $rootScope.__rssFloatPanelConfiguration.data = {
                include: {
                    url: 'app/scripts/main/app/component/follow-feed/follow-feed.view.html',
                    data: {
                        feed: $scope.feed
                    }
                },
                manage: {
                    open: true,
                    overlay: true
                }
            };
        };

        $scope.postsPanelConfiguration = {
            source: $scope.feed,
            settings: {
                user: user,
                viewType: "list",
                filters: 'all' // 'underFirst', 'unread'
            }
        };

        /*
         * todo: add action group for this view
         * */

        /*
        * 1. юзер может быть зарегестрированным или нет
        * 2. юзер зарегестррован
        *       - он может иметь этот фид добавленным в категорию или нет
        *       - если фид не добавлен
        *           - в постах не показывать управляющие кнопки
        *           - показать кнопку - Добавить фид
        *           - возможна сортировка, по типу
        *               - только непрочитанные
        *               - все вместе
        *               - потом будет добавленно другие сортировки
        *       - если фид добавлен
        *           - стандартая ситуация, все возможности включены
        *
        *
        * 3. юзер не зарегистрирован
        *       - не надо показывать кнопку добавить фид в категорию
        *       - на постах не показывать управлющие кнопки, а-ля save for read later
        * */



    });

})();
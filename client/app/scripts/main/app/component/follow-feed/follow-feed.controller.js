(function () {
    'use strict';

    angular.module('rss.app.feed').controller("FollowFeedController", function ($scope) {
        $scope.addCategoryConfiguration = {};
        var config = $scope.__rssConfiguration.data.include.data;
    });

})();
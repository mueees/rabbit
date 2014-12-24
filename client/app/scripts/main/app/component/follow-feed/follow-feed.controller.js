(function () {
    'use strict';

    angular.module('rss.app.feed').controller("FollowFeedController", function ($scope, rssFeedResource) {

        $scope.isDisabled = true;
        $scope.feed = angular.copy($scope.__rssConfiguration.data.include.data.feed);

        $scope.addCategoryConfiguration = {
            newCategory: function (category) {
                $scope.chooseCategoryConfiguration.addCategory(category);
            }
        };

        $scope.followFeed = function () {
            rssFeedResource.add({
                categories: $scope.chooseCategoryConfiguration.categories,
                name: $scope.feed.name,
                feedId: $scope.feed._id
            }).then(function () {
                $scope.__rssConfiguration.data.include.data.feed.isUserFollow = true;
                $scope.close();
            });
        };

        $scope.chooseCategoryConfiguration = {
            categories: []
        };

        $scope.$watch('chooseCategoryConfiguration.categories', function () {
            if($scope.chooseCategoryConfiguration.categories.length){
                $scope.isDisabled = false;
            }else{
                $scope.isDisabled = true;
            }
        });
    });

})();
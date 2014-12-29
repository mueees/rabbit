(function () {
    'use strict';

    angular.module('rss.app.feed').controller("NewFeedController", function ($scope, $stateParams, $state, growl) {
        $scope.feed = $stateParams.feed;

        if(!$scope.feed){
            //redirect to home page
            growl.addInfoMessage("Cannot find feed.");
            $state.go('main.app.index.home');
        }

    });

})();
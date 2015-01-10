(function(){
    'use strict';

    angular.module('rss.core.components.time-left').directive('rssTimeLeft', function ($interval, rssWebComponent) {

        return rssWebComponent.RssUiComponentClass({
            restrict: "E",
            replace: true,
            templateUrl: "app/scripts/core/components/time-left/time-left.directive.view.html",

            link: function (scope, element, attrs, controllers) {
                var date = scope.rssConfiguration.getConfiguration();

                if(rss.util.isStringWithLength(date)){
                    date = new Date(date);
                }

                $interval(calculateTime, 5000);

                function getTimeAgo(){
                    return new Date() - date;
                }

                function calculateTime(){
                    var time = getTimeAgo();

                    if( rss.util.isLessMinute(time) ){
                        scope.showDate = rss.util.getSeconds(time) + ' sec ago';
                    }else if(  rss.util.isLessHours(time) ){
                        scope.showDate = rss.util.getMinutes(time) + ' mins ago';
                    }else if(  rss.util.isLessDay(time) ){
                        scope.showDate = rss.util.getHours(time) + ' hours ago';
                    }else{
                        scope.showDate = rss.util.getDays(time) + ' days ago';
                    }
                }

                calculateTime();

            }
        });
    });

})();
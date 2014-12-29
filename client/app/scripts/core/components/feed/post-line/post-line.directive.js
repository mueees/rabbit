(function(){
    'use strict';
    angular.module('rss.core.components.feed.post-line').directive('rssPostLine', function (rssWebComponent) {
        return rssWebComponent.RssUiComponentClass({

            restrict: "E",

            link: function (scope) {
                var config = scope.rssConfiguration.getConfiguration();
                scope.post = config.post;
                scope.user = config.user;
                scope.data = {
                    isOpen: false
                };

                scope.goToPost = function (event, post) {
                    event.preventDefault();


                }

                scope.postClick = function () {
                    //mark as unread or read
                    //open on float-container

                    /*
                    *
                    * Should pass source to float-container
                    * and open current post there
                    *
                    * */
                }
            },

            templateUrl: "app/scripts/core/components/feed/post-line/post-line.directive.view.html"

        });
    });
})();
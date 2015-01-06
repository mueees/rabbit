(function(){
    'use strict';
    angular.module('rss.core.components.feed.post-line').directive('rssPostLine', function (rssWebComponent) {
        return rssWebComponent.RssUiComponentClass({

            restrict: "E",

            link: function (scope) {
                var config = scope.rssConfiguration.getConfiguration();

                var postResource = config.post;
                scope.post = postResource.plain();
                scope.user = config.user;
                scope.data = {
                    isOpen: false
                };

                scope.postClick = function () {
                    //open on float-container
                    scope.data.isOpen = !scope.data.isOpen;

                    if( postResource.users && !postResource.users.isRead ){
                        scope.post.users.isRead = true;
                        postResource.read({
                            _id: postResource._id
                        });
                    }

                    //mark as unread or read

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
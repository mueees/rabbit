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
                    isOpen: false,
                    pubdata: scope.post.pubdata
                };

                scope.linkHandler = function (event) {
                    event.stopPropagation();
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
                }
            },

            templateUrl: "app/scripts/core/components/feed/post-line/post-line.directive.view.html"

        });
    });
})();
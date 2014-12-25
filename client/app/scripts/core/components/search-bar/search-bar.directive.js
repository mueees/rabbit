(function(){
    'use strict';
    angular.module('rss.core.components.search-bar').directive('rssSearchBar', function (rssWebComponent, rssSearchResource) {
        return rssWebComponent.RssUiComponentClass({

            restrict: "E",

            templateUrl: "app/scripts/core/components/search-bar/search-bar.directive.view.html",

            link: function (scope, element, attrs) {

                scope.response = {};
                scope.searchRequest = '';
                
                scope.$watch('searchRequest', function (searchRequest) {

                    if(rss.util.isStringWithLength(searchRequest)){
                        rssSearchResource.find({search: searchRequest}).then(function (data) {
                            scope.response = data;
                        }, function () {
                            scope.response = {};
                        });
                    }else{
                        scope.response = {};
                    }
                });

                scope.clearSearchRequest = function () {
                    scope.searchRequest = '';
                }

            }


        });
    });
})();
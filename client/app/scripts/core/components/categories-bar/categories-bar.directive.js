(function(){
    'use strict';

    angular.module('rss.core.components.categories-bar').directive('rssCategoriesBar', function ($rootScope, $state, $stateParams, rssWebComponent, rssCategoryResource) {

        return rssWebComponent.RssUiComponentClass({
            restrict: "E",
            templateUrl: "app/scripts/core/components/categories-bar/categories-bar.directive.view.html",

            scopeDecorators: [
                'RssStateDecorator'
            ],

            link: function (scope, element, attrs, controllers) {

                scope.categories = [];

                rssCategoryResource.listFeed().then(function (categories) {
                    scope.categories = categories;
                    debugger;
                    scope.rssStateEngine.transitionTo('visibility.hidden');
                }, function () {
                });

                scope.activeFeed = null;

                scope.isFeedActive = function (category) {
                    var res = _.where(category.feeds, {_id: scope.activeFeed});
                    if(res && res.length){
                        return true;
                    }else{
                        return false;
                    }
                };

                scope.isActive = function(_id){
                    if( scope.activeFeed == _id ){
                        return true;
                    }  else{
                        return false;
                    }
                };

                function deselectAllFeed(){
                    scope.activeFeed = null;
                }

                function chooseFeed(id){
                    scope.activeFeed = id;
                }

                function routeChange(){
                    if($state.current.name == 'main.app.index.feed'){
                        deselectAllFeed();
                        chooseFeed($stateParams.id);
                    }else{
                        deselectAllFeed();
                    }
                }

                $rootScope.$on('$stateChangeSuccess', routeChange);

                routeChange();

            }
        });
    });

})();
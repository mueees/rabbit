(function () {
    'use strict';
    angular.module('rss.core.security').factory('rssAuthUserResource', function (rssResource) {
        var UserResource = rssResource.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.addElementTransformer('user', false, function (user) {
                user.addRestangularMethod('signup', 'post', 'signup', undefined);
                user.addRestangularMethod('signin', 'post', 'signin', undefined);
                user.addRestangularMethod('logout', 'post', 'logout');
                return user;
            });
        });
        return UserResource.one('user');
    });
})();
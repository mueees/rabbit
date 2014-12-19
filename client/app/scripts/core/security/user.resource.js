(function () {
    'use strict';
    angular.module('rss.core.security').factory('rssAuthUserResource', function (rssResource) {
        var UserResource = rssResource.withConfig(function(RestangularConfigurer){
            RestangularConfigurer.addElementTransformer('user', false, function (user) {
                user.addRestangularMethod('login', 'post', 'login', undefined, {'Content-Type': 'application/x-www-form-urlencoded'});
                user.addRestangularMethod('logout', 'post', 'logout');
                return user;
            });
        });
        return UserResource.one('user');
    });
})();
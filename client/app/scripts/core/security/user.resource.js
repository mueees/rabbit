(function () {
    'use strict';
    angular.module('rss.core.security').factory('rssAuthUserResource', function (rssResource) {

        var authUserResource = rssResource.withUrlConfiguration('/api', function (RestangularConfigurer) {
            RestangularConfigurer.addElementTransformer('jwt', true, function (user) {
                user.addRestangularMethod('login', 'post', 'login', undefined, {'Content-Type': 'application/x-www-form-urlencoded'});
                user.addRestangularMethod('logout', 'post', 'logout');
                return user;
            });
        });

        return authUserResource;

    });
})();
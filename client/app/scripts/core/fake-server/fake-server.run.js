(function () {
    'use strict';
    angular.module('rss.core.fake-server').run(function ($httpBackend, $timeout) {
            var timeout = 2000;
            console.log(1);



            $httpBackend.when('GET', '/category', {
                'bla': 'bla'
            });

        });
})();
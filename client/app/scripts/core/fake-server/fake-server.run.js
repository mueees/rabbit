(function () {
    'use strict';
    angular.module('rss.core.fake-server').run(function ($httpBackend, $timeout) {
        var timeout = 2000;
        $httpBackend.when('GET', '/category').passThrough();
    });
})();
(function () {
    'use strict';
    angular.module('rss.core.fake-server')
        .config(function($provide) {
            $provide.decorator('$httpBackend', function($delegate) {

                var timeout = 500;

                var proxy = function(method, url, data, callback, headers) {
                    var interceptor = function() {
                        var _this = this,
                            _arguments = arguments;
                        setTimeout(function() {
                            callback.apply(_this, _arguments);
                        }, timeout);
                    };
                    return $delegate.call(this, method, url, data, interceptor, headers);
                };
                for(var key in $delegate) {
                    proxy[key] = $delegate[key];
                }
                return proxy;
            });
        })
        .run(function ($timeout, $httpBackend, RSS_CONFIG) {
            var baseUrl = '/api/v'+RSS_CONFIG.api.version+'/rss/application';


            //user api
            $httpBackend.whenPOST(baseUrl+'/user/signup').respond({
                token: "Fake token"
            });

            //category
            $httpBackend.whenGET(baseUrl+'/categories/getFullCategories?token=Fake+token').respond([{
                _id: '2132134',
                name: "Test category",
                feeds: [
                    {
                        _id: '123',
                        name: 'Habrahabr feed'
                    },
                    {
                        _id: '234',
                        name: 'Weekend'
                    }]
            }]);

        });
})();
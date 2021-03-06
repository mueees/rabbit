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

            $httpBackend.whenPOST(baseUrl+'/categories/add').respond({
                _id: '2132134'
            });

            $httpBackend.whenGET(new RegExp(baseUrl+'/category/list/feed?.*')).respond([{
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

            //feed
            $httpBackend.whenPOST(baseUrl+'/feed/add').respond({
            });

            $httpBackend.whenGET(new RegExp(baseUrl+'/feed?.*')).respond({
                _id: '123123',
                name: "Web Feed",
                inDatabase: true,
                isUserFollow: false,
                meta: {
                    readers: 12,
                    unread: 213
                },
                posts: [
                    {
                        _id: '123',
                        title: 'Some crazy post',
                        body: "This is body",
                        link: "http://google.com",
                        guid: "Fake guid",
                        image: "http://www.fresnostate.edu/csm/ees/images/earth.jpg",
                        pubdate: new Date(),
                        source: "http://google.com",
                        feedId: "Fake feed id",
                        dateCreate: new Date(),
                        user: {
                            isRead: false,
                            readLater: false,
                            tags: []
                        }
                    },
                    {
                        _id: '1223',
                        title: 'Some crazy post',
                        body: "This is body",
                        link: "http://google.com",
                        guid: "Fake guid",
                        image: "http://www.fresnostate.edu/csm/ees/images/earth.jpg",
                        pubdate: new Date(),
                        source: "http://google.com",
                        feedId: "Fake feed id",
                        dateCreate: new Date(),
                        user: {
                            isRead: true,
                            readLater: false,
                            tags: []
                        }
                    }
                ]
            });

            $httpBackend.whenPOST(new RegExp(baseUrl+'/post/getPosts?.*')).respond([
                {
                    id: '213',
                    title: 'test1'
                },
                {
                    id: '2134',
                    title: 'test2'
                }
            ]);

            //search
            $httpBackend.whenPOST(baseUrl+'/search/find').respond({
                feeds: [
                    {
                        name: 'Habrahabr.ru',
                        _id: "234234"
                    },
                    {
                        name: 'Boston.prospect',
                        _id: "45456"
                    }
                ],
                sites: [
                    {
                        name: 'Boston.prospect',
                        url: "http://bla-bla.ua/feed"
                    }
                ]
            });

        });
})();
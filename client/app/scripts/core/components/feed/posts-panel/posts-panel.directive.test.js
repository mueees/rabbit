describe('rssPostsPanel', function () {

    var element,
        $compile,
        scope,
        rssFeedResource,
        $httpBackend;

    beforeEach(module('templates', 'rss.core.resources', 'rss.core.components.feed.posts-panel'));

    beforeEach(inject(function ($rootScope, _$compile_, _$httpBackend_, rssFeedResource) {
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        rssFeedResource = rssFeedResource;

        element = angular.element('<rss-posts-panel rss-configuration="postsPanelConfiguration"></rss-posts-panel>');
        scope = $rootScope;

        scope.postsPanelConfiguration = {
            settings: {
                viewType: "list",
                filters: 'all' // 'underFirst', 'unread'
            }
        };

        _expectRequestUrlToContain();

        rssFeedResource.getById().then(function (data) {
            scope.postsPanelConfiguration.source = data;
        });
        $httpBackend.flush();


    }));

    var _expectRequestUrlToContain = function () {
        var baseUrl = '/api/v1/rss/application';

        $httpBackend.expectPOST(baseUrl+'/feed/getById').respond(200, {

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
                    name: 'Some crazy post'
                },
                {
                    _id: '234',
                    name: 'Bla bla bla'
                },
                {
                    _id: '123234',
                    name: 'Interesting 1'
                },
                {
                    _id: '23445',
                    name: 'This is me and we'
                }
            ]
        });
    };

    it('should exist settings and posts', function () {
        $compile(element)(scope);
        scope.$digest();

        var isolateScope = element.isolateScope();
        isolateScope.$apply();

        expect(isolateScope.settings).toBeDefined();
        expect(isolateScope.posts).toBeDefined();
    });

    it('should display posts', function () {
        $compile(element)(scope);
        scope.$digest();


        var $post = element.find('rss-post-line');
        expect($post.length).toEqual(4);
    });

});
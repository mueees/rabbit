describe('rssHttpResponseErrorInterceptor', function () {

    beforeEach(module('rss.core.error-handling'));

    beforeEach(module(function ($httpProvider) {
        $httpProvider.interceptors.push('rssHttpResponseErrorInterceptor');
    }));


    it('should delegate error processing to rssServerErrorHandler service', inject(function ($http, $httpBackend, rssServerErrorHandler) {
        var errorResponse = {
            foo: 'bar'
        };

        spyOn(rssServerErrorHandler, 'handleServerResponseError');

        $httpBackend.whenGET('/').respond(500, errorResponse);
        $http.get('/');
        $httpBackend.flush();

        expect(rssServerErrorHandler.handleServerResponseError).toHaveBeenCalledWith(jasmine.objectContaining({
            data: errorResponse
        }));
    }));
});
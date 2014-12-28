describe('rssServerErrorHandler', function () {

    var rssServerErrorHandler,
        $http,
        $httpBackend,
        errorMessages;

    beforeEach(module('rss.core.error-handling', 'rss.core.resources', function ($httpProvider) {
        $httpProvider.interceptors.push('rssHttpResponseErrorInterceptor');
    }));

    beforeEach(inject(function (_rssServerErrorHandler_, _$http_, _$httpBackend_) {
        rssServerErrorHandler = _rssServerErrorHandler_;
        $http = _$http_;
        $httpBackend = _$httpBackend_;
    }));

    beforeEach(inject(function ($rootScope) {
        var scope = $rootScope.$new();

        errorMessages = [];

        scope.$on('errorMessage', function (e, message) {
            errorMessages.push(message);
        });
    }));

    function _makeRequest(url, status, response) {
        $httpBackend.whenGET(url).respond(status, response);
        $http.get(url);
        $httpBackend.flush();
    }

    it('should exist', function () {
        expect(rssServerErrorHandler).toBeDefined();
        expect(rss.util.isFunction(rssServerErrorHandler.handleServerResponseError)).toEqual(true);
    });

    it('should broadcast error for each server response error', function () {
        var errors = {
            message: 'foo'
        };

        _makeRequest('/url1', 500, errors);

        expect(errorMessages).toHaveLength(1);
        expect(errorMessages[0]).toEqual(errors.message);

    });

    it('should broadcast error for each server response errors', function () {
        var errors = {
            messages: [
                'foo',
                'boo'
            ]
        };

        _makeRequest('/url1', 500, errors);
        expect(errorMessages).toHaveLength(1);
        expect(errorMessages[0]).toEqual(errors.messages[0] + '</br >' + errors.messages[1]);

    });

    it('should broadcast error with generic message when network error occurs', inject(function (RSS_ERROR_MESSAGES) {
        _makeRequest('/', 0); // status of 0 indicates network error

        expect(errorMessages[0]).toEqual(RSS_ERROR_MESSAGES.httpNetworkError);
    }));

});

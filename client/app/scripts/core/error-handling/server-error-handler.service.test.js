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

    it('should retrieve error details from response', function () {
        var errors = [
            {
                messageText: 'error one'
            },
            {
                messageText: 'error two'
            }
        ];

        expect(rssServerErrorHandler.getServerResponseErrorDetails({
            data: errors
        })).toEqual(errors);

        expect(rssServerErrorHandler.getServerResponseErrorDetails(null)).toBeNull();

        expect(rssServerErrorHandler.getServerResponseErrorDetails({})).toBeNull();

        expect(rssServerErrorHandler.getServerResponseErrorDetails([])).toBeNull();

        expect(rssServerErrorHandler.getServerResponseErrorDetails([
            {
                foo: 'bar' // no messageText property
            }
        ])).toBeNull();
    });

    it('should broadcast error for each server response error', function () {
        var errors = [
            {
                messageText: 'foo'
            },
            {
                messageText: 'bar'
            }
        ];

        _makeRequest('/url1', 500, errors);
        _makeRequest('/url2', 400);

        expect(errorMessages).toHaveLength(3);
        expect(errorMessages[0]).toEqual(errors[0].messageText);
        expect(errorMessages[1]).toEqual(errors[1].messageText);
    });

    it('should broadcast error with message built from details in server response', function () {
        var errors = [
            {
                messageText: 'foo'
            },
            {
                messageText: 'foo',
                messageAppendedText: 'bar'
            }
        ];

        _makeRequest('/', 500, errors);

        expect(errorMessages[0]).toEqual('foo');
        expect(errorMessages[1]).toEqual('foo: bar');
    });

    it('should broadcast error with generic message if server response contains no error details', inject(function (RSS_ERROR_MESSAGES) {
        var status = 404,
            expectedErrorMessage = rss.string.format(RSS_ERROR_MESSAGES.httpDefaultError, status);

        _makeRequest('/', status);

        expect(errorMessages).toHaveLength(1);
        expect(errorMessages[0]).toEqual(expectedErrorMessage);
    }));

    it('should broadcast error with generic message when network error occurs', inject(function (RSS_ERROR_MESSAGES) {
        _makeRequest('/', 0); // status of 0 indicates network error

        expect(errorMessages[0]).toEqual(RSS_ERROR_MESSAGES.httpNetworkError);
    }));



});

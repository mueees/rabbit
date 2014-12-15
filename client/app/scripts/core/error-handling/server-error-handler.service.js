(function () {
    'use strict';
    angular.module('rss.core.error-handling').factory('rssServerErrorHandler', function ($rootScope, $q, RSS_ERROR_MESSAGES) {

        function getServerResponseErrorDetails(response){
            var errorDetails = null;

            if (response && rss.util.isArrayWithLength(response.data) && rss.util.isStringWithLength(response.data[0].messageText)) {
                errorDetails = response.data;
            }

            return errorDetails;
        }

        function _buildMessageFromErrorDetails(errorDetails) {
            var message = errorDetails.messageText;

            if (errorDetails.messageAppendedText) {
                message += ': ' + errorDetails.messageAppendedText;
            }

            return message;
        }

        function _buildMessageFromRawResponse(response) {
            var message;

            if (response.status === 0) {
                message = RSS_ERROR_MESSAGES.httpNetworkError;
            } else {
                var status = response.status || '';

                if (response.statusText) {
                    status += ' ' + response.statusText;
                }

                message = rss.string.format(RSS_ERROR_MESSAGES.httpDefaultError, status);
            }

            return message;
        }

        /**
         * Handless server response errors by building the error message from response object and displaying it to the user
         * **/
        function handleServerResponseError(response){
            var errors = getServerResponseErrorDetails(response),
                message;

            if (errors) {
                angular.forEach(errors, function (error) {
                    message = _buildMessageFromErrorDetails(error);
                    $rootScope.$broadcast('errorMessage', message);
                    alert(message);
                });
            } else {
                message = _buildMessageFromRawResponse(response);
                $rootScope.$broadcast('errorMessage', message);
                alert(message);
            }
        }

        return {
            handleServerResponseError: handleServerResponseError,
            getServerResponseErrorDetails: getServerResponseErrorDetails
        };
    });
})();
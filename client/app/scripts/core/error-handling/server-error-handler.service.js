(function () {
    'use strict';
    angular.module('rss.core.error-handling').factory('rssServerErrorHandler', function ($rootScope, $q, RSS_ERROR_MESSAGES, growl) {

        function getServerResponseError(response){
            var errorDetails = null;

            if (response && response.data) {

                if (rss.util.isStringWithLength(response.data.message)) {
                    errorDetails = response.data.message;
                }else if( rss.util.isArrayLike(response.data.messages) ){
                    errorDetails = response.data.messages.join('</br >');
                }

            } else{
                errorDetails = _buildMessageFromRawResponse(response);
            }

            return errorDetails;
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
            var error = getServerResponseError(response);

            growl.addErrorMessage(error);
            $rootScope.$broadcast('errorMessage', error);
        }

        return {
            handleServerResponseError: handleServerResponseError
        };
    });
})();
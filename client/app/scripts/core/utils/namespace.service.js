(function () {
    'use strict';
    angular.module('rss.core.utils')
        .factory('rssNameSpace', function () {
            /**
             * Generates a namespace string using the specified array
             * @param {...} var_args Multiple parameters of arrays of string, strings or objects with the method getNamespace or toString
             * @returns {string}
             */
            var getNameSpaceString = function (var_args) {
                var namespace = [];
                rss.util.forEach(arguments, function (argument) {
                    if (rss.util.isArrayWithLength(argument)) {
                        namespace.push(getNameSpaceString.apply(null, argument));
                    } else if (rss.util.isStringWithLength(argument)) {
                        namespace.push(argument);
                    } else if (rss.util.isObject(argument)) {
                        if (rss.util.isFunction(argument.getNamespace)) {
                            namespace.push(getNameSpaceString(argument.getNamespace()));
                        } else if (rss.util.isFunction(argument.getNameSpace)) {
                            namespace.push(getNameSpaceString(argument.getNameSpace()));
                        } else if (rss.util.isFunction(argument.toString)) {
                            namespace.push(argument.toString());
                        }
                    } else {
                        rss.assert.assert(false, 'The argument type is not supported.');
                    }
                });

                return namespace.join('.');
            };

            /**
             * Converts a namespace string representation to an array of names.
             * @param {!string} namespace
             * @returns {!Array<string>}
             */
            var getNameSpaceArray = function (namespace) {
                rss.assert.assertStringWithLength(namespace);

                return namespace.split('.');
            };

            /**
             * Coverts a namespace to the camel case version so rss.util.name becomes rxUtilName.
             * @param {!string|Array.<string>} namespace
             * @returns {string}
             */
            var getCamelCase = function (namespace) {
                rss.assert.assert(rss.util.isStringWithLength(namespace) || rss.util.isArrayWithLength(namespace));
                if (rss.util.isString(namespace)) {
                    namespace = getNameSpaceArray(namespace);
                }

                rss.util.forEach(namespace, function (name, index) {
                    if (index > 0) {
                        if (name.length > 1) {
                            namespace[index] = name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
                        } else {
                            namespace[index] = name.charAt(0).toUpperCase();
                        }
                    }
                });

                return namespace.join('');
            };

            return {
                toString: getNameSpaceString,
                toArray: getNameSpaceArray,
                toCamelCase: getCamelCase
            };
        });
})();

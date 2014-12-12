var rss = rss || {};

// Required to insure Tests execute correctly since these macros are only replaced on the built code and not the source code
var _LINE_ = 'unknown';
var _FILE_ = 'unknown.js';
var _TIMESTAMP_ = new Date().getTime();

(function () {
    'use strict';

    // Copy the angular over to the rss.util
    rss.util = {};
    angular.extend(rss.util, angular);

    // Expand the existing design and all any new methods we may require.

    /**
     * Determines if a reference is Null
     * @param value
     * @returns {boolean}
     */
    rss.util.isNull = function (value) {
        return value === null;
    };

    /**
     * Determines if a reference is defined and not null
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is defined and not null.
     */
    rss.util.isDefinedAndNotNull = function (value) {
        return (!rss.util.isNull(value) && rss.util.isDefined(value));
    };

    /**
     * Determines if a reference is null or undefined but does not return true for a boolean false value
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is undefined or null.
     */
    rss.util.isUndefinedOrNull = function (value) {
        return rss.util.isNull(value) || rss.util.isUndefined(value);
    };

    /**
     * Determines if a reference is null or undefined but does not return true for a boolean false value
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is undefined or null.
     */
    rss.util.isNullOrUndefined = rss.util.isUndefinedOrNull;

    /**
     * Determines if a reference is an `Array` or something that has length and is an object.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is an `Array Like` .
     */
    rss.util.isArrayLike = function (value) {
        return (rss.util.isArray(value) || (rss.util.isObject(value) && rss.util.isNumber(value.length)));
    };

    /**
     * Uses the typeof JS code to return the type of the input value and will return 'null' for null and
     * 'undefined' for undefined values.
     * @param {*} value
     * @returns {string}
     */
    rss.util.typeOf = function (value) {
        if (rss.util.isNull(value)) {
            return 'null';
        } else if (rss.util.isUndefined(value)) {
            return 'undefined';
        }
        return typeof value;
    };

    /**
     * Returns true if the specified value is a boolean.
     * @param {?} value to test.
     * @return {boolean} Whether value is boolean.
     */
    rss.util.isBoolean = function (value) {
        return typeof value == 'boolean';
    };

    /**
     * Returns true if the specified value is a string and contains data
     * @param {!string} value
     * @returns {boolean}
     */
    rss.util.isStringWithLength = function (value) {
        return rss.util.isString(value) && value.length > 0;
    };

    /**
     * Returns true if the value is an Array that contains data
     * @param value
     * @returns {*|boolean}
     */
    rss.util.isArrayWithLength = function (value) {
        return rss.util.isArray(value) && value.length > 0;
    };

    /**
     * Returns true if the value is a valid angular scope
     * @param value
     * @returns {*|boolean}
     */
    rss.util.isScope = function (value) {
        return rss.util.isObject(value) && rss.util.isFunction(value.$on) && rss.util.isFunction(value.$watch);
    };

    var urlRegEx;

    /**
     * Returns true if the specified string represents a URL type string. It does not validate the URL itself.
     * @param {!string} url
     * @returns {boolean}
     */
    rss.util.isUrlString = function (url) {
        if (!rss.util.isStringWithLength(url)) {
            return false;
        }

        // Lazy initialize the regular expression
        if (rss.util.isUndefinedOrNull(urlRegEx)) {
            urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
        }

        return urlRegEx.test(url);
    };

    /**
     * Wraps the wrapFn function by first calling it and then calling the withFn on the specified context and returning the results of the withFn function
     * @param {!Function} wrapFn
     * @param {!Function} withFn
     * @param {?*=} optContext
     * @returns {Function}
     */
    rss.util.wrapFunction = function(wrapFn, withFn, optContext) {
        rss.assert.assertFunction(wrapFn);
        rss.assert.assertFunction(withFn);
        return function() {
            //ar args = Array.prototype.slice.call(arguments, 0);
            wrapFn.apply(optContext, arguments);
            return withFn.apply(optContext, arguments);
        };
    };
})();

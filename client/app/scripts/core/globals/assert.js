var rx = rx || {};

(function () {
    'use strict';

    // This usually occurs when running tests and do not use rx.util.isBoolean at this point as it may not be loaded yet
    if (typeof rx.ENABLE_ASSERTS !== 'boolean') {
        rx.ENABLE_ASSERTS = true;
    }

    /**
     * Array of error handlers that is called when an assertion failure occurs
     * @type {Array}
     */

    var errorHandlers = [];

    /**
     * Called by the assertion design when an error occurs
     * @param e
     */
    var errorHandler = function (e) {
        throw e;
    };

    /**
     * Throws an exception with the given message and "Assertion failed" prefixed
     * onto it.
     * @param {string} defaultMessage The message to use if givenMessage is empty.
     * @param {Array.<*>} defaultArgs The substitution arguments for defaultMessage.
     * @param {string|undefined} givenMessage Message supplied by the caller.
     * @param {Array.<*>} givenArgs The substitution arguments for givenMessage.
     * @throws {AssertionError} When the value is not a number.
     * @private
     */
    var handleFailure = function (defaultMessage, defaultArgs, givenMessage, givenArgs) {
        var message = 'Assertion failed';
        var messageArgs = null;

        if (givenMessage) {
            message += ': ' + givenMessage;
            messageArgs = givenArgs;
        } else if (defaultMessage) {
            message += ': ' + defaultMessage;
            messageArgs = defaultArgs;
        }

        messageArgs = messageArgs || [];
        messageArgs.unshift(message);

        var error = new Error(rx.string.subs.apply(null, messageArgs));

        // Call all registered handlers but make sure they can prevent the default handler
        rx.util.forEach(errorHandlers, function (handler) {
            try {
                if (rx.util.isFunction(handler)) {
                    handler(error);
                }
            } catch (e) {
            }
        });

        // Call the main error handler
        errorHandler(error);
    };

    /**
     * The main Assert Object
     * @type {{setErrorHandler: setErrorHandler, assert: assert, fail: fail, assertNumber: assertNumber,
     *        assertDefinedAndNotNull: assertDefinedAndNotNull, assertHasLength: assertHasLength,
     *        assertString: assertString, assertStringWithLength: assertStringWithLength,
     *        assertArrayWithLength: assertArrayWithLength, assertFunction: assertFunction, assertObject: assertObject,
     *        assertArray: assertArray, assertBoolean: assertBoolean, assertElement: assertElement,
     *        assertInstanceof: assertInstanceof}}
     */
    rx.assert = {
        /**
         * Sets a custom error handler that can be used to customize the behavior of
         * assertion failures, for example by turning all assertion failures into log
         * messages.
         * @param {function(AssertionError)} errorHandler
         */
        addErrorHandler: function (errorHandlerFn) {
            if (rx.ENABLE_ASSERTS && rx.util.isFunction(errorHandlerFn)) {
                errorHandlers.push(errorHandlerFn);
            }
        },


        /**
         * Checks if the condition evaluates to true if rx.ENABLE_ASSERTS is true.
         * @param {boolean} condition The condition to check.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the condition evaluates to false.
         */
        assert: function (condition, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS && !condition) {
                handleFailure('', null, opt_message, Array.prototype.slice.call(arguments, 2));
            }
        },


        /**
         * Call this to force a failure if an area of the code was reached that is not part of the design.
         *
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} Failure.
         */
        fail: function (opt_message, var_args) {
            if (rx.ENABLE_ASSERTS) {
                handleFailure(
                    'Failure' + (opt_message ? ': ' + opt_message : ''),
                    Array.prototype.slice.call(arguments, 1)
                );
            }
        },

        /**
         * Checks if the value is a number if rx.ENABLE_ASSERTS is true.
         * @param {*} value The value to check.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the value is not a number.
         */
        assertNumber: function (value, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS && !rx.util.isNumber(value)) {
                handleFailure('Expected number but got %s: %s.',
                    [rx.util.typeOf(value), value], opt_message,
                    Array.prototype.slice.call(arguments, 2));
            }
        },

        /**
         * Checks to see if the value is defined and not null
         * @param value
         * @param opt_message
         * @param var_args
         */
        assertDefinedAndNotNull: function (value, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS && !rx.util.isDefinedAndNotNull(value)) {
                handleFailure('Expected a defined value but got %s.',
                    [rx.util.typeOf(value)], opt_message,
                    Array.prototype.slice.call(arguments, 2));
            }
        },

        /**
         * Checks to see if the Array or String has a length greater than zero
         * @param {*} value The value to check and should contain a length property.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the value is not an object.
         */
        assertHasLength: function (value, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS) {
                rx.assert.assertNumber(value.length, 'Expected a length property');

                if (value.length <= 0) {
                    handleFailure('Expected length greater than zero but got %s.',
                        [value.length], opt_message,
                        Array.prototype.slice.call(arguments, 2));
                }
            }
        },

        /**
         * Checks if the value is a string if rx.ENABLE_ASSERTS is true.
         * @param {*} value The value to check.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the value is not a string.
         */
        assertString: function (value, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS && !rx.util.isString(value)) {
                handleFailure('Expected string but got %s: %s.',
                    [rx.util.typeOf(value), value], opt_message,
                    Array.prototype.slice.call(arguments, 2));
            }
        },

        /**
         * Checks if the value is a string if rx.ENABLE_ASSERTS is true and that it is length.
         * @param {*} value The value to check.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the value is not a string.
         */
        assertStringWithLength: function (value, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS) {
                rx.assert.assertString(value, opt_message, var_args);
                rx.assert.assertHasLength(value, opt_message, var_args);
            }
        },

        /**
         * Checks to see if the value is an Array and has a length greater than zero
         * @param {*} value The value to check.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the value is not an object.
         */
        assertArrayWithLength: function (value, opt_message, var_args) {
            rx.assert.assertArray(value, opt_message, var_args);
            rx.assert.assertHasLength(value, opt_message, var_args);
        },

        /**
         * Checks if the value is a function if rx.ENABLE_ASSERTS is true.
         * @param {*} value The value to check.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the value is not a function.
         */
        assertFunction: function (value, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS && !rx.util.isFunction(value)) {
                handleFailure('Expected function but got %s: %s.',
                    [rx.util.typeOf(value), value], opt_message,
                    Array.prototype.slice.call(arguments, 2));
            }
        },

        /**
         * Checks if the value is an Object if rx.ENABLE_ASSERTS is true.
         * @param {*} value The value to check.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the value is not an object.
         */
        assertObject: function (value, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS && !rx.util.isObject(value)) {
                handleFailure('Expected object but got %s: %s.',
                    [rx.util.typeOf(value), value],
                    opt_message, Array.prototype.slice.call(arguments, 2));
            }
        },

        /**
         * Checks if the value is an Array if rx.ENABLE_ASSERTS is true.
         * @param {*} value The value to check.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the value is not an array.
         */
        assertArray: function (value, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS && !rx.util.isArray(value)) {
                handleFailure('Expected array but got %s: %s.',
                    [rx.util.typeOf(value), value], opt_message,
                    Array.prototype.slice.call(arguments, 2));
            }
        },

        /**
         * Checks if the value is a boolean if rx.ENABLE_ASSERTS is true.
         * @param {*} value The value to check.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the value is not a boolean.
         */
        assertBoolean: function (value, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS && !rx.util.isBoolean(value)) {
                handleFailure('Expected boolean but got %s: %s.',
                    [rx.util.typeOf(value), value], opt_message,
                    Array.prototype.slice.call(arguments, 2));
            }
        },

        /**
         * Checks if the value is a DOM Element if rx.ENABLE_ASSERTS is true.
         * @param {*} value The value to check.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the value is not a boolean.
         */
        assertElement: function (value, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS && (!rx.util.isObject(value) ||
                value.nodeType != rx.util.dom.NodeType.ELEMENT)) {
                handleFailure('Expected Element but got %s: %s.',
                    [rx.util.typeOf(value), value], opt_message,
                    Array.prototype.slice.call(arguments, 2));
            }
        },

        /**
         * Checks if the value is an instance of the user-defined type if rx.ENABLE_ASSERTS is true.
         *
         * The compiler may tighten the type returned by this function.
         *
         * @param {*} value The value to check.
         * @param {function(new: T, ...)} type A user-defined constructor.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the value is not an instance of type.
         */
        assertInstanceof: function (value, type, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS && !(value instanceof type)) {
                handleFailure('instanceof check failed.', null,
                    opt_message, Array.prototype.slice.call(arguments, 3));
            }
        },

        /**
         * Checks if the value is a angular $scope if rx.ENABLE_ASSERTS is true.
         * @param {*} value The value to check.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the value is not a $scope.
         */
        assertScope: function (value, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS && !rx.util.isScope(value)) {
                handleFailure('Expected a valid $scope but got %s: %s.',
                    [rx.util.typeOf(value), value], opt_message,
                    Array.prototype.slice.call(arguments, 2));
            }
        },

        /**
         * Checks if the value is null or undefined
         * @param {*} value The value to check.
         * @param {string=} opt_message Error message in case of failure.
         * @param {...*} var_args The items to substitute into the failure message.
         * @throws {AssertionError} When the value is not null or undefined.
         */
        assertNullOrUndefined: function (value, opt_message, var_args) {
            if (rx.ENABLE_ASSERTS && !rx.util.isNullOrUndefined(value)) {
                handleFailure('Expected a value that is null or undefined but got %s: %s.',
                    [rx.util.typeOf(value), value], opt_message,
                    Array.prototype.slice.call(arguments, 2));
            }
        }
    };
})();

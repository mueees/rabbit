/**
 * Configuration file for the unit testing part of this design
 */

var grunt = require('grunt');

module.exports = function (config) {

    // TODO Figure out if we can run a single test file based on source that changed if matching file is found
    // TODO Figure out a way where we can run a task in grunt to test main code and one that runs tests on the built code at build of pom

    // Load all the required files
    var modulesJS = ['app/scripts/**/*.module*.js'];
    var sourceJS = ['app/scripts/**/*.js'];
    var userConfig = require( './build.config.js' );

    var testJS = userConfig.app_files.js.test;
    var vendor_js = userConfig.vendor_files.js;
    var templates = ['app/**/*.html'];

    var allFiles = vendor_js.concat(testJS, modulesJS, sourceJS, templates);

    config.set({
        /**
         * From where to look for files, starting with the location of this file.
         */
        basePath: '.',

        /**
         * This is the list of file patterns to load into the browser during testing.
         */
        files: allFiles,

        // list of files to exclude
        exclude: [],

        preprocessors: {
            'app/scripts/**/!(*.test).js': ['coverage'],
            'app/**/*.html': ['ng-html2js']
        },

        ngHtml2JsPreprocessor: {
            cacheIdFromPath: function (filepath) {
                return filepath; // skip 'app/'
            },

            moduleName: 'templates'
        },

        frameworks: ['jasmine'],

        plugins: [
            'karma-jasmine',
            'karma-firefox-launcher',
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-phantomjs-launcher',
            'karma-ng-html2js-preprocessor'
        ],

        logLevel: 'WARN',

        /**
         * How to report, by default.
         */
        reporters: [
            'dots',
            'coverage'
        ],

        coverageReporter: {
            type: 'html',
            dir: 'target/coverage/'
        },
        /**
         * On which port should the browser connect, on which port is the test runner
         * operating, and what is the URL path for the browser to use.
         */
        port: 9090,

        urlRoot: '/',

        /**
         * Disable file watching by default.
         */
        autoWatch: false,

        /**
         * The list of browsers to launch to test on. This includes only "PhantomJS" by
         * default, but other browser names include:
         * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
         * 
         * Note that you can also use the executable name of the browser, like "chromium"
         * or "firefox", but that these vary based on your operating system.
         *
         * You may also leave this blank and manually navigate your browser to
         * http://localhost:9018/ when you're running tests. The window/tab can be left
         * open and the tests will automatically occur there during the build. This has
         * the aesthetic advantage of not launching a browser every time you save.
         */
        browsers: ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
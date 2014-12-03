module.exports = {
    build_dir: 'build',
    compile_dir: 'bin',

    app_files: {
        js: {
            //angular templates
            templates: ['app/scripts/**/*.tpl.html'],

            //all js unit tests
            jsunit: [ 'app/scripts/**/*.spec.js' ],

            // main module (rss)
            main: [
                'app/scripts/rss.module.js',
                'app/scripts/rss.*.js'
            ],

            // all js application file without main, unit test
            app: [
                'app/scripts/**/*.js',
                '!app/scripts/**/*.spec.js',
                '!app/scripts/rss.*.js'
            ],

            all: [
                'app/scripts/**/*.js'
            ]
        },

        stylus: {
            default: 'app/stylus/rss-default.styl',
            dark: 'app/stylus/rss-dark.styl'
        },

        html: 'app/index.html'
    },

    vendor_files: {
        js: [
            'app/vendor/angular/angular.js',

            'app/vendor/underscore/underscore-min.js',

            'app/vendor/restangular/dist/restangular.min.js',

            'app/vendor/angular-mocks/angular-mocks.js',
            'app/vendor/angular-touch/angular-touch.min.js',
            'app/vendor/angular-ui-router/release/angular-ui-router.min.js',
            'app/vendor/angular-animate/angular-animate.min.js'
        ],
        css: [
            'app/vendor/bootstrap/dist/css/bootstrap.css'
        ],
        assets: [

        ]
    }
};
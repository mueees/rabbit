module.exports = {
    build_dir: 'build',
    compile_dir: 'bin',
    compile_dir_scripts_temp: 'bin/scripts/temp',

    app_files: {
        js: {
            //angular templates
            templates: ['app/scripts/**/*.view.html'],

            //all js unit tests
            jsunit: [ 'app/scripts/**/*.spec.js' ],

            // main module (rss)
            main: [
                'app/scripts/rss.module.js',
                'app/scripts/rss.*.js',
                '!app/scripts/*.spec.js'
            ],

            // all js application file without main, unit test
            app: [
                'app/scripts/**/*.module.js',
                'app/scripts/**/*.config.js',
                'app/scripts/**/*.route.js',
                'app/scripts/**/*.constant.js',
                'app/scripts/**/*.value.js',
                'app/scripts/**/*.run.js',
                'app/scripts/**/*.service.js',
                'app/scripts/**/*.class.js',
                'app/scripts/**/*.directive.js',
                'app/scripts/**/*.controller.js',
                'app/scripts/**/*.resource.js',
                'app/scripts/**/*.filter.js',
                '!app/scripts/**/*.spec.js',
                '!app/scripts/rss.module.js',
                '!app/scripts/rss.*.js'
            ],

            core: [
                'app/scripts/core/**/*.js'
            ],

            all: [
                'app/scripts/**/*.js'
            ],
            html: [
                'app/index.html'
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
module.exports = {
    build_dir: 'build',
    compile_dir: 'bin',
    compile_dir_scripts_temp: 'bin/scripts/temp',

    app_files: {
        js: {
            //angular templates
            templates: ['app/scripts/**/*.view.html'],

            //all js unit tests
            jsunit: [ 'app/scripts/**/*.test.js' ],

            // main module (rss)
            main: [
                'app/scripts/rss/rss.module.js',
                'app/scripts/rss/rss.*.js',
                '!app/scripts/rss/*.test.js'
            ],

            // all js application file without main, core and unit test
            app: [
                'app/scripts/main/**/*.module.js',
                'app/scripts/main/**/*.config.js',
                'app/scripts/main/**/*.route.js',
                'app/scripts/main/**/*.constant.js',
                'app/scripts/main/**/*.value.js',
                'app/scripts/main/**/*.run.js',
                'app/scripts/main/**/*.service.js',
                'app/scripts/main/**/*.class.js',
                'app/scripts/main/**/*.directive.js',
                'app/scripts/main/**/*.controller.js',
                'app/scripts/main/**/*.resource.js',
                'app/scripts/main/**/*.filter.js',
                '!app/scripts/main/**/*.test.js'
            ],

            core: [
                'app/scripts/core/globals/*.js',
                'app/scripts/core/**/*.module.js',
                'app/scripts/core/**/*.config.js',
                'app/scripts/core/**/*.route.js',
                'app/scripts/core/**/*.constant.js',
                'app/scripts/core/**/*.value.js',
                'app/scripts/core/**/*.run.js',
                'app/scripts/core/**/*.service.js',
                'app/scripts/core/**/*.class.js',
                'app/scripts/core/**/*.directive.js',
                'app/scripts/core/**/*.controller.js',
                'app/scripts/core/**/*.resource.js',
                'app/scripts/core/**/*.filter.js',
                '!app/scripts/core/**/*.test.js'
            ],

            all: [
                'app/scripts/**/*.js',
                '!app/scripts/**/*.test.js'
            ],

            html: [
                'app/index.html'
            ],

            test: [
                'app/vendor/jquery/dist/jquery.js',
                'app/vendor/jasmine-jquery/lib/jasmine-jquery.js'
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

            'app/vendor/angular-growl/build/angular-growl.js',

            'app/vendor/angular-mocks/angular-mocks.js',
            'app/vendor/angular-sanitize/angular-sanitize.js',
            'app/vendor/angular-touch/angular-touch.min.js',
            'app/vendor/angular-ui-router/release/angular-ui-router.min.js',
            'app/vendor/angular-animate/angular-animate.min.js',
            'app/vendor/angular-busy/dist/angular-busy.min.js',
            'app/vendor/ngstorage/ngStorage.js'
        ],
        css: [
            'app/vendor/bootstrap/dist/css/bootstrap.css',
            'app/vendor/angular-busy/angular-busy.css'
        ],
        assets: [

        ]
    }
};
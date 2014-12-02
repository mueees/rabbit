module.exports = {
    build_dir: 'build',
    compile_dir: 'bin',

    app_files: {
        atpl: ['app/scripts/**/*.tpl.html'],

        // all js files without test
        js: [ 'app/scripts/**/*.js', '!app/scripts/**/*.spec.js' ],

        jsunit: [ 'app/scripts/**/*.spec.js' ],

        stylus: {
            default: 'app/stylus/rss-default.styl',
            dark: 'app/stylus/rss-dark.styl'
        },
        html: 'app/index.html'
    },

    vendor_files: {
        js: [
            'app/vendor/jQuery/dist/jquery.min.js',
            'app/vendor/angular/angular.js',
            'app/vendor/underscore/underscore-min.js',

            'app/vendor/restangular/dist/restangular.min.js',
            'app/vendor/restangular/dist/underscore-min.map',

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
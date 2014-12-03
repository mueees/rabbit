module.exports = function ( grunt ) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html-build');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-jsvalidate');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-html2js');

    // Uses to change the root name oldPrefix of a long folder name to newPrefix
    var changeRootFolder = function (names, oldPrefix, newPrefix) {
        var newNames = [];
        if (names) {
            if (typeof names === 'string') {
                names = [names];
            }

            for (var loop = 0; loop < names.length; loop++) {
                newNames.push(changePrefix(names[loop], oldPrefix, newPrefix));
            }


        }

        return newNames;
    };
    // Changes the prefix on the name by remove oldPrefix and replacing it with newPrefix
    var changePrefix = function (name, oldPrefix, newPrefix) {
        if (name && name.length && oldPrefix && oldPrefix.length && newPrefix && newPrefix.length) {
            if (name.indexOf(oldPrefix) === 1 && name[0] === '!') {
                return ('!' + newPrefix + name.substr(oldPrefix.length + 1));
            } else if (name.indexOf(oldPrefix) === 0) {
                return (newPrefix + name.substr(oldPrefix.length));
            }
        }

        return name;
    };

    var userConfig = require( './build.config.js' );

    var taskConfig = {
        pkg: grunt.file.readJSON("package.json"),
        html2js: {
            app: {
                options: {},
                src: [ '<%= app_files.js.templates %>' ],
                dest: 'app/scripts/rss.templates.js'
            }
        },
        copy: {
            app_assets: {
                files: [
                    {
                        src: [ '**' ],
                        dest: '<%= build_dir %>/app/assets',
                        cwd: 'app/assets',
                        expand: true,
                        flatten: false
                    }
                ]
            },
            app_js: {
                files: [
                    {
                        src: [
                            '<%= app_files.js.all %>'
                        ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            vendor_js: {
                files: [
                    {
                        src: [ '<%= vendor_files.js %>' ],
                        dest: '<%= build_dir %>/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            vendor_css: {
                files: [
                    {
                        src: [ '<%= vendor_files.css %>' ],
                        dest: '<%= build_dir %>/app/assets/css/vendor',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            compile_assets: {
                files: [
                    {
                        src: [ '**' ],
                        dest: '<%= compile_dir %>/assets',
                        cwd: '<%= build_dir %>/app/assets',
                        expand: true
                    }
                ]
            }
        },
        stylus: {
            dev: {
                options: {
                    compress: false
                },
                files: {
                    'app/assets/css/default-<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.stylus.default %>',
                    'app/assets/css/dark-<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.stylus.dark %>'
                }
            },
            compile: {
                options: {
                    compress: true
                },
                files: {
                    'app/assets/css/default-<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.stylus.default %>',
                    'app/assets/css/dark-<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.stylus.dark %>'
                }
            }
        },
        clean: {
            build: [
                '<%= build_dir %>'
            ],
            compile: '<%= compile_dir %>',
            compile_script_temp: '<%= compile_dir_scripts_temp %>'
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: false
            }
        },
        jshint: {
            src: [
                '<%= app_files.js.app %>'
            ],
            test: [
                '<%= app_files.js.jsunit %>'
            ],
            gruntfile: [
                'Gruntfile.js'
            ],
            options: {
                curly: true,
                immed: true,
                newcap: false,
                noarg: true,
                sub: true,
                boss: true,
                eqnull: true,
                debug: true,
                validthis: true
            },
            globals: {}
        },
        jsvalidate: {
            options: {
                globals: {},
                esprimaOptions: {},
                verbose: false
            },
            targetName: {
                files: {
                    src: ['<%=app_files.js.app%>']
                }
            }
        },
        concat: {
            //javascript files
            compile_vendor: {
                src:[
                    '<%= vendor_files.js %>'
                ],
                dest: '<%= compile_dir %>/scripts/temp/vendor_templates.js'
            },
            compile_main: {
                src:[
                    'module.prefix',
                    '<%= app_files.js.main %>',
                    'module.suffix'
                ],
                dest: '<%= compile_dir %>/scripts/temp/main.js'
            },
            compile_app: {
                options: {},
                src: [
                    'module.prefix',
                    '<%= app_files.js.app %>',
                    'module.suffix'
                ],
                dest: '<%= compile_dir %>/scripts/temp/app.js'
            },
            compile_js: {
                options: {},
                src: [
                    '<%= concat.compile_vendor.dest %>',
                    '<%= concat.compile_main.dest %>',
                    '<%= concat.compile_app.dest %>'
                ],
                dest: '<%= compile_dir %>/scripts/<%= pkg.name %>-<%= pkg.version %>.js'
            },
            //css files
            compile_css: {

            }
        },
        htmlbuild: {
            dev: {
                src: 'app/index.html',
                dest: '<%= build_dir %>/app',
                options: {
                    beautify: true,
                    prefix: '.',
                    relative: true,
                    scripts: {
                        templates: [
                            '<%= build_dir %>/app/scripts/rss.templates.js'
                        ],
                        libs: changeRootFolder(userConfig.vendor_files.js, 'app/vendor', '<%= build_dir %>/app/vendor'),
                        main: changeRootFolder(userConfig.app_files.js.main, 'app/scripts', '<%= build_dir %>/app/scripts'),
                        app: changeRootFolder(userConfig.app_files.js.app, 'app/scripts', '<%= build_dir %>/app/scripts')
                    },
                    styles: {
                        start: [
                            '<%= build_dir %>/app/assets/css/start.css'
                        ],
                        vendor: [
                            '<%= build_dir %>/app/assets/css/vendor/*.css'
                        ],
                        app: [
                            '<%= build_dir %>/app/assets/css/*.css',
                            '!<%= build_dir %>/app/assets/css/start.css'
                        ]
                    }
                }
            },
            compile: {
                src: 'app/index.html',
                dest: '<%= compile_dir %>/',
                options: {
                    beautify: true,
                    prefix: '.',
                    relative: true,
                    scripts: {
                        templates: [],
                        libs: [],
                        app: [],
                        main: [
                            '<%= concat.compile_js.dest %>'
                        ]
                    },
                    styles: {
                        start: [],
                        vendor: [],
                        app: [
                            '<%= build_dir %>/app/assets/**/*.css'
                        ]
                    }
                }
            }
        },
        watch: {
            jssrc: {
                files: [
                    '<%= app_files.js.app %>'
                ],
                tasks: [ 'jshint:src', 'copy:app_js' ]
            },
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: [ 'jshint:gruntfile' ],
                options: {
                    livereload: false
                }
            },
            html: {
                files: [ '<%= app_files.html %>' ],
                tasks: [ 'htmlbuild:dev' ]
            },
            tpls: {
                files: [
                    '<%= app_files.js.templates %>'
                ],
                tasks: [ 'html2js:app' ]
            },
            stylus: {
                files: [ 'src/**/*.styl' ],
                tasks: [ 'stylus:dev', 'copy:app_assets' ]
            }
        },
        uglify: {
            compile: {
                options: {},
                files: {
                    '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
                }
            }
        }
    };

    grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

    grunt.registerTask("development", [
        /*'karma',*/
        'clean:build',
        'stylus:dev',
        'jsvalidate',
         'jshint',
        'copy:app_assets',
        'copy:app_js',
        'copy:vendor_js',
        'copy:vendor_css',
        'html2js:app',
        'htmlbuild:dev'
    ]);

    grunt.registerTask( 'compile', [
        'clean:compile',
        /*
         'jsvalidate',
         'jshint',
         'stylus:compile',
         'copy:compile_assets',*/
        'html2js:app',
        'concat:compile_vendor',
        'concat:compile_main',
        'concat:compile_app',
        'concat:compile_js',
        'uglify',
        'htmlbuild:compile',
        'clean:compile_script_temp'
    ]);

    grunt.registerTask('debug', 'Main task for development', function () {
        grunt.task.run('development');
        grunt.task.run('watch');
    });



};
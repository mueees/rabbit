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
        console.log("START");
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
                options: {
                    base: 'src/app'
                },
                src: [ '<%= app_files.atpl %>' ],
                dest: '<%= build_dir %>/app/templates-app.js'
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
                        src: [ '<%= app_files.js %>' ],
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
                        dest: '<%= build_dir %>/app/assets/css',
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
        clean: [
            '<%= build_dir %>',
            '<%= compile_dir %>'
        ],
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: false
            }
        },
        jshint: {
            src: [
                '<%= app_files.js %>'
            ],
            test: [
                '<%= app_files.jsunit %>'
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
                    src: ['<%=app_files.js%>']
                }
            }
        },
        concat: {
            css_default: {
                src: [
                    '<%= vendor_files.css %>',
                    'app/assets/css/default-<%= pkg.name %>-<%= pkg.version %>.css'
                ],
                dest: 'app/assets/css/default-<%= pkg.name %>-<%= pkg.version %>.css'
            },

            compile_js: {
                options: {},
                src: [
                    '<%= vendor_files.js %>',
                    'module.prefix',
                    '<%= html2js.app.dest %>',
                    '<%= build_dir %>/app/scripts/**/*.js',
                    'module.suffix'
                ],
                dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
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
                            '<%= build_dir %>/app/templates-app.js'
                        ],
                        libs: changeRootFolder(userConfig.vendor_files.js, 'app/vendor', '<%= build_dir %>/app/vendor'),
                        app: [
                            changeRootFolder(userConfig.app_files.js, 'app/scripts', '<%= build_dir %>/app/scripts'),
                            '!<%= build_dir %>/app/scripts/rss.*.js'
                        ],
                        main: [
                            '<%= build_dir %>/app/scripts/rss.module.js',
                            '<%= build_dir %>/app/scripts/rss.*.js'
                        ]
                    },
                    styles: {
                        libs: [

                        ],
                        app: [
                            '<%= build_dir %>/app/assets/**/*.css'
                        ]
                        /*libs: getCssOnly(vendorsDebugCssBuild),*/
                    }
                }
            },
            compile: {
                src: 'app/index.html',
                dest: '<%= build_dir %>/app',
                options: {
                    beautify: true,
                    prefix: '.',
                    relative: true,
                    scripts: {
                        templates: [
                            '<%= build_dir %>/app/templates-app.js'
                        ],
                        libs: changeRootFolder(userConfig.vendor_files.js, 'app/vendor', '<%= build_dir %>/app/vendor'),
                        app: [
                            changeRootFolder(userConfig.app_files.js, 'app/scripts', '<%= build_dir %>/app/scripts'),
                            '!<%= build_dir %>/app/scripts/rss.*.js'
                        ],
                        main: [
                            '<%= build_dir %>/app/scripts/rss.module.js',
                            '<%= build_dir %>/app/scripts/rss.*.js'
                        ]
                    },
                    styles: {
                        libs: [

                        ],
                        app: [
                            '<%= build_dir %>/app/assets/**/*.css'
                        ]
                        /*libs: getCssOnly(vendorsDebugCssBuild),*/
                    }
                }
            }
        },
        watch: {
            jssrc: {
                files: [
                    '<%= app_files.js %>'
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
                tasks: [ 'htmlbuild' ]
            },
            tpls: {
                files: [
                    '<%= app_files.atpl %>'
                ],
                tasks: [ 'html2js' ]
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
        'jsvalidate',
        'jshint',
        'clean',
        'html2js',
        'stylus:dev',
        'copy:app_assets',
        'copy:app_js',
        'copy:vendor_js',
        'copy:vendor_css',
        'htmlbuild:dev'
    ]);

    grunt.registerTask('debug', 'Main task for development', function () {
        grunt.task.run('development');
        grunt.task.run('watch');
    });


    grunt.registerTask( 'compile', [
        'jsvalidate',
        'jshint',
        'stylus:compile',
        'copy:compile_assets',
        'concat:compile_js',
        'uglify',
        'htmlbuild:compile'
    ]);

};
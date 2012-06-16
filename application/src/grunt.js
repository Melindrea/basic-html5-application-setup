/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: {
            version: '0.1.0',
            description: "Something or another...",
            name: "A name",
            license: "Some license",
            homepage: "http://blah",
            author: {
                name: "Marie Hogebrandt"
            },
            licenses: [
                {
                    "type": "",
                    "url": ""
                }
            ]
        },
        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* <%= pkg.homepage %> \n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
                '<%= pkg.author.name %>; Licensed ' + 
                '<%= _.pluck(pkg.licenses, "type").join(", ") %>*/'
        },
        dirs: {
            src: 'js/',
            dest: '../assets/js/'
        },
        lint: {
            files: ['grunt.js', 'js/**/*.js', '../test/js/**/*.js']
        },
        qunit: {
            files: ['../test/**/*.html']
        },
        concat: {
            application: {
                src: [
                    '<banner>', 
                    '<%= dirs.src %>app/*.js'
                    ],
                dest: '<%= dirs.src %>app.js'
            },
            all: {
                src: [
                    '<banner>', 
                    '<%= dirs.src %>*.js'
                    ],
                dest: '<%= dirs.dest %>script.js'
            }
        },
        min: {
            all: {
                src: ['<banner>', '<config:concat.all.dest>'],
                dest: '<%= dirs.dest %>script.min.js'
            }
        },
        watch: {
            'lint': {
                files: '<config:lint.files>',
                tasks: 'lint'
            },
            'sass': {
                files: 'sass/*.scss',
                tasks: 'shell:sass'
            },
            'less': {
                files: 'less/*.less',
                tasks: 'less'
            }
        },
        jshint: {
            options: {
                curly: true,
                plusplus: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true
            },
            globals: {
                jQuery: true,
                Em: true,
                Ember: true,
                require: true
            }
        },
        uglify: {},
        shell: {
            sass: {
                command: 'compass compile',
                stdout: true
            }
        },
        less: {
            compile: {
                files: {
                    '../assets/design/style.css': 'less/style.less'
                },
                options: {
                    paths: ['less/import']
                }
            }
        }
    });
    
    // Default task.
    grunt.registerTask('default', 'lint concat min');
    
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib');
    //grunt.loadNpmTasks('grunt-smushit');
};


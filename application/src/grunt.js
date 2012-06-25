/*global module:false*/
module.exports = function(grunt) {
	"use strict";
	// Project configuration.
	grunt.initConfig({
		pkg: '<json:../config/package.json>',
		meta: {
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'* <%= pkg.homepage %>\n' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
				'<%= pkg.author.name %>; Licensed ' +
				'<%= _.pluck(pkg.licenses, "type").join(", ") %>*/'
		},
		dirs: {
			base: {
				src: '',
				dest: '../assets/'
			},
			js: {
				src: '<%= dirs.base.src %>js/',
				dest: '<%= dirs.base.dest %>js/'
			},
			sass: {
				src: '<%= dirs.base.src %>sass/',
				dest: '<%= dirs.base.dest %>design/'
			},
			less: {
				src: '<%= dirs.base.src %>less/',
				dest: '<%= dirs.base.dest %>design/'
			}
		},
		tests: {
			base: '../test/',
			js: '<%= tests.base %>js/**/*.js',
			html: '<%= tests.base %>html/**/*.html'
		},
		lint: {
			files: ['grunt.js', '<%= dirs.js.src %>**/*.js', '<%= tests.js %>']
		},
		qunit: {
			files: ['<%= tests.html %>']
		},
		concat: {
			application: {
				src: [
					'<banner>',
					'<%= dirs.js.src %>app/*.js'
					],
				dest: '<%= dirs.js.src %>app.js'
			},
			zeroClipboard: {
				src: [
					'<banner>',
					'<%= dirs.js.src %>jquery-plugins/*.js'
					],
				dest: '<%= dirs.js.src %>jquery-plugins.js'
			},
			all: {
				src: [
					'<banner>',
					'<%= dirs.js.src %>*.js'
					],
				dest: '<%= dirs.js.dest %>script.js'
			}
		},
		min: {
			all: {
				src: ['<banner>', '<config:concat.all.dest>'],
				dest: '<%= dirs.js.dest %>script.min.js'
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
				eqeqeq: true,
				forin: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				noempty: true,
				nonew: true,
				plusplus: false,
				regexp: true,
				undef: true,
				strict: true,
				trailing: true,
				eqnull: true,
				browser: true,
				jquery: true
			},
			globals: {
				Em: true,
				Ember: true,
				require: true,
				swfobject: true,
				i: true,
				j: true,
				k: true
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
			homepage: {
				src: '<%= dirs.less.src %>bootstrap.less',
				dest: '<%= dirs.less.dest %>bootstrap.css',
				options: {
					yuicompress: true
				}
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'js sass');
	
	grunt.registerTask('js', 'lint concat min');
	grunt.registerTask('sass', 'shell:sass');
	grunt.registerTask('test', 'qunit');

	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-less');
	//grunt.loadNpmTasks('grunt-smushit');
	
};


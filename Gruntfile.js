/* jshint indent:2, node:true */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    copy: {
      dist: {
        files: [
          { dest: 'dist/', src: ['.htaccess', 'favicon.ico', 'signing-key.asc', 'latest-version.txt'] },
          { dest: 'dist/', src: 'assets/fonts/**' },
          { dest: 'dist/', src: 'assets/img/**' }
        ]
      }
    },

    includereplace: {
      dist: {
        options: {
          globals: {
            version: '<%= pkg.version %>'
          }
        },
        files: [
          { src: '*.html', dest: 'dist/' }
        ]
      }
    },

    cssmin: {
      compress: {
        options: {
          compatibility: 'ie8',
          keepSpecialComments: 0,
          report: 'min'
        },
        files: {
          'dist/assets/css/pack-<%= pkg.version %>.css': [
            'assets/css/normalize.css',
            'assets/css/style.css',
            'assets/css/gh-fork-ribbon.css',
          ]
        }
      }
    },

    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: false,
        report: 'min'
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          removeComments: true
        },
        expand: true,
        cwd: 'dist',
        dest: 'dist',
        src: ['**/*.html']
      }
    },

    watch: {
      options: {
        livereload: true
      },
      files: ['assets/**/*', 'index.html', 'Gruntfile.js'],
      tasks: 'build'
    },

    connect: {
      server: {
        options: {
          base: 'dist/',
          port: 4000
        }
      }
    },

    validation: {
      options: {
        charset: 'utf-8',
        doctype: 'HTML5',
        failHard: true,
        reset: true
      },
      files: {
        src: 'dist/**/*.html'
      }
    },

    clean: {
      dist: 'dist/'
    }
  });

  // Load any grunt plugins found in package.json.
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
  require('time-grunt')(grunt);

  grunt.registerTask('build', [
    'clean',
    'copy',
    'includereplace',
    'cssmin',
    'uglify',
    'htmlmin'
  ]);

  grunt.registerTask('test', [
    'build',
    'validation'
  ]);

  grunt.registerTask('default', [
    'build',
    'connect',
    'watch'
  ]);
};

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-docco-multi');
  
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      createdb: {
        command: [
        "mysql -u root -e 'create database shwopDB;'",
        "echo Lets go shwoping!"
        ].join('&&')
      }
    },
    sass: {                                                        // Task
      dist: {                                                      // Target
        files: {                                                   // Dictionary of files
          'client/styles/style.css': 'client/styles/style.scss',   // 'destination': 'source'
        }
      }
    },

    execute: {
      dummy: {
        src: ['server/db/dummy_data.js']
      },
      // clear: {
      //   src: ['server/db/clear_db.js']
      // }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/server/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },

    database: {
      shell: {
        options: {
          stdout: true,
          stderr: true
        },

      }
    },

    karma: {  
      unit: {
        options: {
          frameworks: ['mocha', 'chai', 'sinon'],
          singleRun: true,
          browsers: ['Firefox'],
          files: [

            'client/lib/angular/angular.js',
            'client/lib/angular-route/angular-route.min.js',
            'client/lib/mobile-angular-ui/dist/js/mobile-angular-ui.gestures.min.js',
            'client/lib/mobile-angular-ui/dist/js/mobile-angular-ui.min.js',
            'client/lib/angular-translate/angular-translate.min.js',
            'client/lib/angular-mocks/angular-mocks.js',
            'client/lib/ngFitText/src/ng-FitText.js',
            'client/lib/jquery/dist/jquery.min.js',
            'client/app/**/*.js',
            'client/langs/*.js',
            'test/client/unit_testing/**/*.js'
          ]
        }
      }
    },

    uglify: {
      options: {
        mangle: false,
        sourceMap: true
      },
      build: {
        src: ['client/**/*.js', '!client/lib/**/*.js'],
        dest: 'client/build/ugly.min.js'
      }
    },

    jshint: {
      all: [
        'client/**/*/*.js',
        'server/**/*/*.js',
      ],
      options: {
        force: 'true',
        jshintrc: '_.jshintrc',
        ignores: [
          'client/lib/**/*',
          'client/photos/**/*',
          'client/sell/canvas-to-blob.js',
          'client/build/*'
        ]
      }
    },

    docco: {
      all: {
        files: {
          src: ['client/app/**/*.js',
          'server/**/*.js']
        }
      }, 
      options: {
        output: 'docs/'
      }
    }

    // cssmin: {
    //     // Add filespec list here
    // },

    // watch: {
    //   scripts: {
    //     files: [
    //       'public/client/**/*.js',
    //       'public/lib/**/*.js',
    //     ],
    //     tasks: [
    //       'concat',
    //       'uglify'
    //     ]
    //   },
    //   css: {
    //     files: 'public/*.css',
    //     tasks: ['cssmin']
    //   }
    // },

    // shell: {
    //   prodServer: {
    //   }
    // },

  });

  

  // grunt.registerTask('server-dev', function (target) {
  //   // Running nodejs in a different process and displaying output on the main console
  //   var nodemon = grunt.util.spawn({
  //        cmd: 'grunt',
  //        grunt: true,
  //        args: 'nodemon'
  //   });
  //   nodemon.stdout.pipe(process.stdout);
  //   nodemon.stderr.pipe(process.stderr);

  //   grunt.task.run([ 'watch' ]);
  // });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest',
    'karma'
    ]);

  grunt.registerTask('runSass', ['sass']);

  grunt.registerTask('check', ['jshint']);

  grunt.registerTask('ugly', ['uglify']);

  grunt.registerTask('create', function(n) {
    grunt.task.run(['shell:createdb']);
  });


  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('default', function(n) {
    grunt.task.run(['nodemon']);
  });

  grunt.registerTask('dummy', function(n) {
    grunt.task.run(['execute:dummy']);
  });

  // grunt.registerTask('clear', function(n) {
  //   grunt.task.run(['execute:clear']);
  // });

  grunt.registerTask('start', function(n) {
    grunt.task.run(['sass']);
    grunt.task.run(['nodemon']);
  });

  grunt.registerTask('deploy', function() {
      // add your production server task here
  });


};


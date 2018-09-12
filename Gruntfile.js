module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    config: {
      work: {
        options: {
          variables: {
            'environment': 'work',
            'configuration': 'catalunya-map-options-v1.js',
            'style': 'src/css/catalunya-map-v3.css',
            'url': 'https://work.catalunyamedieval.dev/wp-content/themes/catalunyamedieval/assets/js/catalunya-map/catalunya-map-path.json'
          }
        }
      },
      prod: {
        options: {
          variables: {
            'environment': 'production',
            'configuration': 'catalunya-map-options-v1.js',
            'style': 'src/css/catalunya-map-v3.css',
            'url' : 'https://www.catalunyamedieval.es/wp-content/themes/catalunyamedieval/assets/js/catalunya-map/catalunya-map-path.json'
          }
        }
      },
      map: {
        options: {
          variables: {
            'environment': 'map',
            'configuration': 'catalunya-map-options-v1.js',
            'style': 'src/css/catalunya-map-v3.css',
            'url': 'assets/js/catalunya-map/catalunya-map-path.json'
          }
        }
      },
      demo: {
        options: {
          variables: {
            'environment': 'demo',
            'configuration': 'catalunya-map-options-v2.js',
            'style': 'src/css/catalunya-map-v3.css',
            'url': 'assets/js/catalunya-map/catalunya-map-path.json'
          }
        }
      },
      int: {
        options: {
          variables: {
            'environment': 'int',
            'configuration': 'catalunya-map-options-v1.js',
            'style': 'src/css/catalunya-map-v3.css',
            'url': 'https://int.catalunyamedieval.es/wp-content/themes/catalunyamedieval/assets/js/catalunya-map/catalunya-map-path.json'
          }
        }
      }
    },
    "jsbeautifier": {
      files: ["src/js/*.js"],
      options: {}
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! Generated <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      my_target: {
        files: {
          'assets/js/catalunya-map/catalunya-map.min.js': ['src/js/catalunya-map.js'],
          'assets/js/catalunya-map/scale.raphael.min.js': ['src/js/scale.raphael.js'],
          'assets/js/catalunya-map/jquery-3.2.1.min.js': ['src/js/jquery-3.2.1.js'],
          'assets/js/catalunya-map/catalunya-map-init.min.js': ['src/js/catalunya-map-init.js'],
          'assets/js/catalunya-map/bootstrap.min.js': ['src/js/bootstrap.js'],
        }
      }
    },
    copy: {
      options: {
        punctuation: ''
      },
      main: {
        files: [
          {
            src:['src/css/bootstrap.min.css'],
            dest: 'assets/css/catalunya-map/bootstrap.min.css'
          },
          {
            src:['src/css/main.css'],
            dest:'assets/css/catalunya-map/main.min.css'
          },
          {
            src: ['src/css/bootstrap-theme.min.css'],
            dest:'assets/css/catalunya-map/bootstrap-theme.min.css'
          },
          {
            src: ['src/js/catalunya-map-path.json'],
            dest:'assets/js/catalunya-map/catalunya-map-path.json'
          },
          {
            src: ['src/js/raphael.min.js'],
            dest:'assets/js/catalunya-map/raphael.min.js'
          }

        ],
      },
      catdev: {
        files: [
          {
            src:['assets/css/catalunya-map/catalunya-map.min.css'],
            dest:'../catalunyamedieval/assets/css/catalunya-map/catalunya-map.min.css'
          },
          {
            src:['assets/js/catalunya-map/catalunya-map-init.min.js'],
            dest:'../catalunyamedieval/assets/js/catalunya-map/catalunya-map-init.min.js'
          },
          {
            src:['assets/js/catalunya-map/catalunya-map.min.js'],
            dest:'../catalunyamedieval/assets/js/catalunya-map/catalunya-map.min.js'
          },
          {
            src: ['assets/js/catalunya-map/catalunya-map-options.js'],
            dest: '../catalunyamedieval/assets/js/catalunya-map/catalunya-map-options.js'
          },
        ],
      },
      configurationFiles:
        {
          files:
            [
              {
                src: ['src/js/<%= grunt.config.get("configuration") %>'],
                dest: 'dist/<%= grunt.config.get("environment") %>/catalunya-map-options.js'
              },
              {
                src: ['assets/css/catalunya-map/catalunya-map.min.css'],
                dest: 'dist/<%= grunt.config.get("environment") %>/catalunya-map.min.css'
              },
            ],
        },
    },
    clean: ['assets/js/', 'assets/css/'],
    cssmin: {
      target: {
        files: [{
          dest: 'assets/css/catalunya-map/catalunya-map.min.css',
          src: ['<%= grunt.config.get("style") %>']
        }]
      }
    },
    // make a zipfile
    compress: {
      main: {
        options: {
          archive: 'dist/map-<%= grunt.config.get("environment") %>.zip'
        },
        files: [
          {expand: true, cwd: 'assets/', src: ['**'], dest: 'map/assets'} // makes all src relative to cwd
        ]
      }
    },
    watch: {
      scripts: {
        files: ['src/js/*.js'],
        tasks: ['map','work'],
        options: {
          spawn: false,
        },
      },
    },
    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: 'REPLACE_URL_JSON',
              replacement: '<%= grunt.config.get("url") %>'
            }
          ],
          prefix: '##',
          usePrefix: true
        },

        files: [
          {
            src: ['src/js/<%= grunt.config.get("configuration") %>'],
            dest: 'assets/js/catalunya-map/catalunya-map-options.js'
          }
        ]
      }
    }
  });

  // Load required modules
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-config');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-replace');

  // Task definitions
  grunt.registerTask('map',  ['config:map',  'jsbeautifier', 'uglify', 'copy', 'replace', 'cssmin']);
  grunt.registerTask('demo', ['config:demo', 'jsbeautifier', 'uglify', 'copy', 'replace', 'cssmin']);
  grunt.registerTask('work', ['config:work', 'jsbeautifier', 'uglify', 'copy', 'replace', 'cssmin']);
  grunt.registerTask('prod', ['config:prod', 'jsbeautifier', 'uglify', 'copy', 'replace', 'cssmin']);
  grunt.registerTask('int',  ['config:int',  'jsbeautifier', 'uglify', 'copy', 'replace', 'cssmin']);

  // Task + deploy
  grunt.registerTask('workd', ['work', 'copy:catdev']);

  //Configuration Files folder
  grunt.registerTask('demo-config',['demo','copy:configurationFiles']);
  grunt.registerTask('prod-config',['prod','copy:configurationFiles']);
  grunt.registerTask('int-config', ['int', 'copy:configurationFiles']);
  grunt.registerTask('work-config',['work','copy:configurationFiles']);

  //Work Compress
  grunt.registerTask('work-compress',['work','compress']);

  grunt.registerTask('release', ['clean','work-compress', 'demo-config', 'prod-config', 'int-config', 'work-config']);

  grunt.registerTask('default', ['clean','map']);
};

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! \n * ' + [
      '<%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>',
      '<%= pkg.homepage %>',
      '',
      'Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.name %> contributors',
      '<%= _.pluck(pkg.licenses, "type").join(", ") %> Licensed',
      '',
      'Released: <%= grunt.template.today("yyyy-mm-dd") %>'
    ].join('\n * ') + '\n */',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      dist: {
        src: ['src/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    jshint: {
      options: {
        // Uncommented are default grunt options
        bitwise: true, //Added from site
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true, //Added from site
        nonew: true, //Added
        quotmark: 'single', //Added
        /* regexp: true, */
        undef: true,
        unused: true, //Added from site
        /* strict: true, //Added from site */
        sub: true,
        boss: true, //dont' allow assignments to be evaluated as truthy/falsey */
        eqnull: true, //Allow == null
        browser: true,
        /* indent: 4, //Added from site */
        devel: true, //Added
        white: false,
        
        es5:       true,
        onecase:   true,
        
        //Adding a few of nice restrictions:
        trailing: true,
        maxparams: 6,
        maxdepth: 9,
        maxerr: 20,
        globals: {
          ActiveXObject: false
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'nodeunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'watch']);

  // Travis-CI task.
  grunt.registerTask('travis', ['jshint', 'concat']);
};

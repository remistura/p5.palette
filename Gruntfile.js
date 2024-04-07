module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    // jshint : {
    // 	files : ['Gruntfile.js', 'src/**/*.js', 'examples/**/*.js'],
    // },
    concat: {
      options: {
        separator: "\n\n",
      },
      dist: {
        src: ["src/index.js", "src/constants.js", "src/palette.js", "src/swatch.js"],
        dest: "dist/<%= pkg.name %>.js",
      },
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: "dist/",
            src: ["p5.palette.min.js"],
            dest: "examples/public/lib",
          },
          {
            expand: true,
            cwd: "dist/",
            src: ["p5.palette.js"],
            dest: "examples/public/lib",
          },
        ],
      },
    },
    uglify: {
      options: {
        compress: {
          global_defs: {
            IS_MINIFIED: true,
          },
        },
        banner: '/*! <%= pkg.name %>.js v<%= pkg.version %> - <%= grunt.template.today("mmmm dd, yyyy") %> - License: <%= pkg.license %> */ ',
      },
      build: {
        src: "dist/<%= pkg.name %>.js",
        dest: "dist/<%= pkg.name %>.min.js",
      },
    },    
    watch: {
      quick: {
        files: ["src/**/*.js"],
        tasks: ["default"],
      },
    },
  });

  // Load external libraries used.
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Default task(s).
  grunt.registerTask("default", ["concat", "uglify", "copy"]);
};

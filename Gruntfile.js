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
        dest: "lib/<%= pkg.name %>.js",
      },
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: "lib/",
            src: ["p5.palette.min.js"],
            dest: "examples/public/lib",
          },
          {
            expand: true,
            cwd: "lib/",
            src: ["p5.palette.js"],
            dest: "examples/public/lib",
          },
        ],
      },
    },
    jsdoc: {
      dist: {
        src: ["src/*.js", "test/*.js"],
        options: {
          destination: "doc",
        },
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
        src: "lib/<%= pkg.name %>.js",
        dest: "lib/<%= pkg.name %>.min.js",
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
  grunt.loadNpmTasks("grunt-jsdoc");

  // Default task(s).
  grunt.registerTask("default", ["concat", "uglify", "copy", "jsdoc"]);
};

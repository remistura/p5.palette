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
        src: ["src/palette.js", "src/constants.js", "src/index.js"],
        dest: "lib/<%= pkg.name %>.js",
      },
    },
    uglify: {
      options: {
        banner:
          '/*! <%= pkg.name %>.js (<%= pkg.version %>): a p5.js library to manage color palettes. Author: <%= pkg.author %>, license: <%= pkg.license %>, <%= grunt.template.today("yyyy-mm-dd") %> */ ',
      },
      build: {
        src: "lib/<%= pkg.name %>.js",
        dest: "lib/<%= pkg.name %>.min.js",
      },
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: "lib/",
            src: ["**"],
            dest: "releases/",
          },
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
	watch: {
		quick: {
		  files: [
			'src/**/*.js',
		  ],
		  tasks: ['default'],
		//   options: {
		// 	livereload: true
		//   }
		},
	},	
  });

  // Load external libraries used.
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask("default", ["concat", "uglify", "copy"]);
};

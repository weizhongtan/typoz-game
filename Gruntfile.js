module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower_concat: {
            all: {
                dest: {
                    'js': 'src/js/_bower.js',
                    'css': 'src/css/_bower.css'
                },
                bowerOptions: {
                    relative: false
                }
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'src',
                // ignores the test folder
                src: ['**', '!**/test/**'],
                dest: 'build/'
            },
        },
    });

    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['bower_concat', 'copy']);
};

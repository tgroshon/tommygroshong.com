'use strict'

var street = require('street')

module.exports = function(grunt) {

  // Project configuration.
  // grunt.initConfig({
  //   pkg: grunt.file.readJSON('package.json')
  // })

  grunt.registerTask('deploy', 'Deploy to S3', function() {
    street({
      src: './dist',
      loadEnv: true,
      verbose: true
    })
  })

}

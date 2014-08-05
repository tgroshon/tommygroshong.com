
var pickFiles = require('broccoli-static-compiler');
var cleanCSS = require('broccoli-clean-css');
// var gzipFiles = require('broccoli-gzip');
var htmlmin = require('broccoli-htmlmin');

var tree = cleanCSS('src');

tree = htmlmin(tree);

/*
tree = gzipFiles(tree, {
	  extensions: ['js', 'css', 'png', 'jpg']
});
*/

module.exports = pickFiles(tree, {
  srcDir: '/',
  destDir: '/'
})

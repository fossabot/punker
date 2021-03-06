// Generated by CoffeeScript 2.1.1
// REQUIRED MODULES #
var babelify, browserify, path;

path = require('path');

browserify = require('browserify');

babelify = require('babelify');

module.exports = function(recess) {
  var plugin, reporter;
  reporter = recess.reporter;
  plugin = {};
  plugin.pipes = {
    bundle: function(bws = {
        presets: ["env", "vue-app"]
      }, bbs) {
      // PIPE #
      return recess.i.stream(async function(files) {
        await recess.d.eachAsync(files, function(file) {
          return new Promise(function(resolve, reject) {
            var bundle, bws2;
            // new browserify bundle
            bws2 = Object.assign({
              basedir: path.dirname(file.path)
            }, bws);
            bundle = browserify(file.contents, bws); // set cwd to file name
            
            // add babelify
            bundle.transform(babelify, bbs);
            // start bundling
            return bundle.bundle(function(err, b) {
              if (err) {
                // throw error
                reporter.error(err);
              }
              file.contents = b;
              return resolve();
            });
          });
        });
        return files;
      });
    }
  };
  return plugin;
};

// Generated by CoffeeScript 2.1.1
var mm;

mm = require('micromatch');

module.exports = function(recess) {
  var plugin, reporter;
  reporter = recess.reporter;
  plugin = {};
  plugin.pipes = {
    pif: function(settings) {
      return recess.i.any(async function(files, cond) {
        await recess.d.eachAsync(settings, async function(pipe, name) {
          var collection, file, filtered, flt, i, id, keys, len, results;
          keys = (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = files.length; i < len; i++) {
              file = files[i];
              results.push(file.path);
            }
            return results;
          })();
          filtered = mm(keys, name);
          results = [];
          for (i = 0, len = filtered.length; i < len; i++) {
            flt = filtered[i];
            for (id in files) {
              file = files[id];
              if (file.path === flt) {
                file = file;
              }
            }
            collection = recess.collection([file], cond);
            await collection.pipe(pipe);
            file = collection.files[0];
            results.push(files[id] = file);
          }
          return results;
        });
        return files;
      });
    }
  };
  plugin.pipes.if = plugin.pipes.cluster = plugin.pipes.switch = plugin.pipes.pif;
  return plugin;
};

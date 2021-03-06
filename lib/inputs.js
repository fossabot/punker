// Generated by CoffeeScript 2.1.1
var sta, stream;

sta = require('stream-to-array');

stream = require('stream');

module.exports = function(recess) {
  var streamify, type;
  recess.i = recess.inputs = recess.input = {};
  type = function(obj) {
    if (typeof obj === 'string') {
      return 'string';
    } else if (Buffer.isBuffer(obj)) {
      return 'buffer';
    } else if ((typeof obj === 'object') && (obj.pipe != null)) {
      return 'stream';
    } else {
      return recess.reporter.error('Unknown type of file contents!');
    }
  };
  recess.i.buffer = function(f) {
    return async function(files) {
      await recess.d.eachAsync(files, async function(file, name) {
        var arr, modified, tp;
        tp = type(file.contents);
        if (tp === 'string') {
          modified = Buffer.from(file.contents);
        } else if (tp === 'buffer') {
          modified = file.contents;
        } else if (tp === 'stream') {
          arr = (await sta(file.contents));
          arr = (await recess.d.mapAsync(arr, function(contents) {
            return Buffer.from(contents);
          }));
          modified = Buffer.contents(arr);
        }
        return files[name].contents = modified;
      });
      return f(...arguments);
    };
  };
  recess.i.string = function(f) {
    return async function(files) {
      await recess.d.eachAsync(files, async function(file, name) {
        var arr, modified, tp;
        tp = type(file.contents);
        if (tp === 'string') {
          modified = file.contents;
        } else if (tp === 'buffer') {
          modified = file.contents.toString();
        } else if (tp === 'stream') {
          arr = (await sta(file.contents));
          arr = (await recess.d.mapAsync(arr, function(contents) {
            return contents.toString();
          }));
          modified = arr.join('');
        }
        return files[name].contents = modified;
      });
      return f(...arguments);
    };
  };
  streamify = function(b) {
    var s;
    s = new stream.Readable;
    s.push(b);
    s.push(null);
    return s;
  };
  recess.i.stream = function(f) {
    return async function(files) {
      await recess.d.eachAsync(files, function(file, name) {
        var modified, tp;
        tp = type(file.contents);
        if (tp === 'string') {
          modified = streamify(file.contents);
        } else if (tp === 'buffer') {
          modified = streamify(file.contents);
        } else if (tp === 'stream') {
          modified = file.contents;
        }
        return files[name].contents = modified;
      });
      return f(...arguments);
    };
  };
  return recess.i.any = function(f) {
    return function() {
      return f(...arguments);
    };
  };
};

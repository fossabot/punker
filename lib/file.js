// Generated by CoffeeScript 2.0.2
var Mode;

Mode = require('stat-mode');

module.exports = function(punk, reporter) {
  return {
    File: class {
      constructor(path, contents = new Buffer(''), stat = 0o777) {
        this.path = path;
        this.contents = contents;
        if (!Buffer.isBuffer(this.contents)) {
          this.contents = Buffer.from(this.contents);
        }
        this.stat = new Mode({
          mode: stat
        });
      }

    }
  };
};
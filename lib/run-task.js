// Generated by CoffeeScript 2.1.1
var fs, gaze;

gaze = require('gaze');

fs = require('fs-extra');

module.exports = function(recess) {
  var reporter, startPipe;
  reporter = recess.reporter;
  startPipe = async function(files, task) {
    var devnull, pipe, ref;
    ref = task.pipes;
    // pass files through pipes
    for (devnull in ref) {
      pipe = ref[devnull];
      await files.pipe(pipe);
    }
    // convert files
    if (task.to && !(task.outFile || task.outDir || task.outDirectory)) {
      await files.pipe(recess.p.to(task.to));
      task.outDir = './';
      await files.pipe(recess.p.write(task));
    } else if (task.to) {
      await files.pipe(recess.p.to(task.to));
    }
    if (task.min) {
      await files.pipe(recess.p.min());
    }
    if (task.start && task.start.length > 0) {
      await recess.run(task.start);
    }
    // write files to FS
    return (await files.pipe(recess.p.write(task)));
  };
  recess._runTask = async function(taskName, task) {
    var files;
    reporter.startingTask(taskName);
    // set settings to standard format
    task = recess.d.toSetting(task);
    if (task.watch) {
      return recess._watchTask(taskName, task);
    }
    files = recess.collection(void 0, task);
    await recess.run(task.needs);
    // load files
    await files.pipe(recess.p.add(task.entry));
    await startPipe(files, task);
    // report
    reporter.finishedTask(taskName);
  };
  recess._watchTask = async function(taskName, task) {
    var changed, running;
    if (task == null) {
      task = recess._tasks[taskName];
    }
    if (typeof task === 'function') {
      reporter.cantWatch(taskName);
      return;
    }
    // r._runTask taskName, task
    // set settings to standard format
    task = recess.d.toSetting(task);
    recess.watchTasks(task.needs);
    running = false;
    recess.dev.keepAlive();
    // load files
    changed = async function(rg) {
      var files;
      files = recess.collection(void 0, task);
      if (rg) {
        await files.pipe(recess.p.add([rg]));
      } else {
        await files.pipe(recess.p.add(task.entry));
      }
      await startPipe(files, task);
      if (rg) {
        reporter.changed(rg);
      }
    };
    gaze(task.entry, function(err) {
      if (err) {
        throw err;
      }
      return this.on('all', async function(event, path) {
        await recess.d.sleep(recess.config.changedDelay);
        return (await changed(path));
      });
    });
  };
  return recess.watch = async function(entry, task) {
    var changed;
    if (task == null) {
      return (await recess._watchTask(entry[0]));
    }
    recess.dev.keepAlive();
    changed = async function(rg) {
      var files;
      files = recess.collection(void 0, task);
      if (rg) {
        await files.pipe(recess.p.add([rg]));
      } else {
        await files.pipe(recess.p.add(entry));
      }
      await task.call(files);
      if (rg) {
        reporter.changed(rg);
      }
    };
    gaze(entry, function(err) {
      if (err) {
        throw err;
      }
      return this.on('all', async function(event, path) {
        await recess.d.sleep(recess.config.changedDelay);
        return (await changed(path));
      });
    });
  };
};

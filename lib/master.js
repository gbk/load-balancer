/*
* @Author: gbk
* @Date:   2016-06-03 14:28:46
* @Last Modified by:   gbk
* @Last Modified time: 2016-08-22 14:36:05
*/

'use strict';

var os = require('os');
var cp = require('child_process');

var guid = 0;

// master class
function Master(name) {
  this.name = '' + (name || guid++);
}

// set thread size
Master.prototype.setThreadSize = function(size) {
  this.size = parseInt(size) || 0;
};

// master send method
Master.prototype.send = function(workerPath, context, jobDetails, callback) {

  // no job specified
  if (jobDetails.length === 0) {
    return callback([]);
  }

  var cpus = os.cpus().length < 2 ? 2 : os.cpus().length;
  var size = this.size || Math.min(os.cpus().length - 1, jobDetails.length);
  var cursor = 0;
  var name = this.name;
  var results = [];
  var resultCount = 0;

  // send job
  var send = function(thread) {
    thread.send({
      __load_balancer__: true,
      name: name,
      cursor: cursor,
      jobDetail: jobDetails[cursor++],
      context: context
    });
  };

  console.log('Thread Pool Size: ' + size);

  while (cursor < size) {
    (function() {

      // create new thread
      var thread = cp.fork(workerPath);

      // create message channel
      thread.on('message', function(msg) {
        if (msg && msg.__load_balancer__) {

          // save job result
          results[msg.cursor] = msg.result;
          resultCount++;

          // has jobs to do
          if (cursor < jobDetails.length) {
            send(thread);

          // all jobs sent
          } else {

            // kill the worker
            thread.kill('SIGINT');

            // all jobs done
            if (callback && resultCount === jobDetails.length) {
              callback(results);
            }
          }
        }
      });

      // send first task
      send(thread);
    })();
  }
};

module.exports = Master;

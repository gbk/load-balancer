/*
* @Author: gbk
* @Date:   2016-06-03 14:28:52
* @Last Modified by:   gbk
* @Last Modified time: 2016-06-03 14:44:23
*/

'use strict';

var guid = 0;

// worker class
function Worker(name) {
  this.name = '' + (name || guid++);
}

// worker receive method
Worker.prototype.receive = function(work) {
  var name = this.name;

  // create message channel
  process.on('message', function(msg) {
    if (msg && msg.__load_balancer__) {

      // do the job
      work(msg.name, msg.context, msg.jobDetail, function(result) {

        // tell master the job is done
        process.send({
          __load_balancer__: true,
          name: name,
          cursor: msg.cursor,
          result: result
        });
      });
    }
  });
}

module.exports = Worker;

/*
 * @Author: gbk
 * @Date:   2016-06-03 13:36:43
 * @Last Modified by:   gbk
 * @Last Modified time: 2016-06-06 10:21:32
 */

'use strict';

var path = require('path');
var fs = require('fs');

var should = require('should');

var Balancer = require('../index.js');

describe('normal case', function() {

  var master = new Balancer.Master();

  it('should return results after all jobs done', function(done) {
    master.send(path.join(__dirname, 'worker.js'), null, new Array(32), function(results) {
      if (results.length === 32) {
        done();
      }
    });
  });

  it('should return results after all jobs done twice', function(done) {
    master.send(path.join(__dirname, 'worker.js'), null, new Array(32), function(results) {
      if (results.length === 32) {
        done();
      }
    });
  });
});

describe('minify assets', function() {

  var master = new Balancer.Master();

  // master.setThreadSize(1);

  it('should return results after all jobs done', function(done) {
    this.timeout(30000);
    var workPath = path.join(__dirname, 'assets.js');
    var assetsDir = path.join(__dirname, 'assets');
    var files = fs.readdirSync(assetsDir);
    master.send(workPath, null, files, function(results) {
      if (results.length === files.length) {
        done();
      }
    });
  });
});

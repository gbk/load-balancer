/*
* @Author: gbk
* @Date:   2016-06-03 14:52:56
* @Last Modified by:   gbk
* @Last Modified time: 2016-06-03 15:27:41
*/

'use strict';

var fs = require('fs');
var path = require('path');
var UglifyJs = require('uglify-js');
var postcss = require('postcss');
var cssnano = require('cssnano');
var processer = new postcss([
  cssnano({
    autoprefixer: {
      add: true
    }
  })
]);

var Balancer = require('../index.js');

var worker = new Balancer.Worker();

worker.receive(function(master, context, jobDetail, callback) {

  var file = path.join(__dirname, 'assets', jobDetail);

  // minify js file
  if (/\.js$/.test(file)) {
    console.log('  Minify file: ' + file);
    var result = UglifyJs.minify(file, {
      mangle: false,
      compress: {
        warnings: false,
        drop_console: false
      },
      comments: false
    });
    fs.writeFileSync(file, result.code);
    callback({});

  // minify css file
  } else if (/\.css$/.test(file)) {
    console.log('  Minify file: ' + file);
    processer.process(fs.readFileSync(file, 'utf-8'), {
      from: file,
      to: file
    }).then(function(result) {
      fs.writeFileSync(file, result.css);
      callback({});
    });

  // in case of files not support
  } else {
    callback({});
  }
});

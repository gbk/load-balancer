/*
* @Author: gbk
* @Date:   2016-06-03 13:43:59
* @Last Modified by:   gbk
* @Last Modified time: 2016-06-03 14:44:52
*/

'use strict';

var Balancer = require('../index.js');

var worker = new Balancer.Worker();

worker.receive(function(master, context, jobDetail, callback) {
    setTimeout(callback, 50);
});

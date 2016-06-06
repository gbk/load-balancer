# load-balancer

[![npm version](https://badge.fury.io/js/load-balancer.svg)](http://badge.fury.io/js/load-balancer)

---

## Introduction

Load-balancer is a task manager for nodejs tasks.

If you have lots of independent tasks,
and wish them to be done as soon as possible,
you can try this tool!

Load-balancer will take full usage of CPUs.

![](https://gw.alicdn.com/tfscom/TB17LAQKXXXXXbiXFXXXXXXXXXX)

- Create workers.
- Master send tasks to every worker.
- When a worker finishes it's task, will receive a new one from master.
- If no more tasks remain, workers will be killed.

## Installation

```shell
npm i load-balancer --save
```

## Usage

`master.js`
```js
var Balancer = require('load-balancer');
...
// create a master
var master = new Balancer.Master('Master A');
// master send jobs to workers
master.send('worker.js', context, jobDetails, function(results) {
    // all jobs done here
});
```

`worker.js`
```js
var Balancer = require('load-balancer');
...
// create a worker
var worker = new Balancer.Worker('Worker A');
// worker receive job from master
worker.receive(function(master, context, jobDetail, callback) {
    // deal with jobDetail
    callback(result);
});
```

## Examples

You can find more examples [here](./test).

## Benchmarking

```shell
npm test
```

See `minify assets` case:

Case | Duration(ms)
--- | ---
1 Process(Normal) | 21947
Multi-Processes(Auto) | 12840

> Intel® Core™ i5-6200U CPU @ 2.30GHz × 4  
> Ubuntu 16.04 64bit

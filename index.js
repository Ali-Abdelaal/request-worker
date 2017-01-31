const constants = require('./constants');

var worker = require('./lib/worker')
  , config = require('./config')
  , winston = require('winston');

var index = exports;

index.worker = worker;

index.init = function () {
  // SET In configuration ?
  var address = process.env.MQ_ADDRESS;

  if (!address) {
    winston.log('info', "Please, you should spesify 'MQ_ADDRESS' ENV VARIABLE.")
    process.exit(1);
  }

  index.worker.init(address);
};

index.init();
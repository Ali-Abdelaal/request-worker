const constants = require('./constants');

var worker = require('./lib/worker')
  , config = require('./config')
  , winston = require('winston');

var index = exports;

index.worker = worker;

index.init = function () {
  if (!config.mq.address) {
    winston.log('info', "Please, you should spesify 'MQ_ADDRESS' ENV VARIABLE.")
    process.exit(1);
  }

  index.worker.init(config.mq.address);
};

index.init();
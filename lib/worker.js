const constants = require('../constants');
var config = require('../config')
    , winston = require('winston');

var worker = {};

// initalize MQ producer based on configuration type
// default mq is rabbitmq
if (config.mq.type === constants.mq_type.ZERO_MQ) {
    worker = require('../lib/zeromq/worker');
} else {
    worker = require('../lib/rabbitmq/worker');
}

module.exports = worker;
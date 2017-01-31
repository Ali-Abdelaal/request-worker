const constants = require('../../constants');

var amqp = require('amqplib/callback_api')
  , winston = require('winston');

var worker = exports;

worker.resolver = require('target-resolver');

/**
 * @desc init rabbitmq server and initailzation
 * @param address used in server amqp server connection like 'amqp://localhost'
 */
worker.init = function (address) {
  worker.address = address;
  worker.channel = null;
  worker.request_queue = constants.rabbitmq.REQ_QUEUE;
  winston.log('info', 'Try connect to %s', address);
  amqp.connect(worker.address, worker.onServerConnected);
};

/**
 * @desc this is amqp connection callback and should create the channel
 */
worker.onServerConnected = function (err, conn) {
  if (err) {
    winston.log('info', error);
    throw new Error("Fail to connect the server");
  }

  conn.createChannel(worker.onChannelCreated);
  winston.log('info', 'The server is connected');
};

/**
 * @desc channel creation callback and should set queue specs
 */
worker.onChannelCreated = function (err, channel) {
  if (err) {
    winston.log('info', error);
    throw new Error("Fail to create channel");
  }

  worker.channel = channel;
  worker.channel.assertQueue(worker.request_queue, { durable: true });

  worker.channel.consume(worker.request_queue, function (request) {
    worker.handleRequest(request);
  }, { noAck: false });
};

/**
 * @description handle the server request 
 * by resolve the target and send reply by target status
 * @param req : the request form the server
 */
worker.handleRequest = function (req) {
  var request = JSON.parse(req.content.toString());
  winston.log("info", 'The reqested target is: %s', request.target);

  worker.resolver.resolve(
    request.target, request.resolveType, function (result) {
      var reply = worker.buildReply(request.target, result);
      console.log(" [x] Done");
      worker.channel.ack(req);
      //worker.sendReply(reply);
    });
};

/**
 * @description build reply message 
 * @param target : the ip or url 
 * @param isUp : indicate if it up or down  
 */
worker.buildReply = function (target, isUp) {
    var reply = {
        target: target,
        isUp: isUp
    };

    return JSON.stringify(reply);
};

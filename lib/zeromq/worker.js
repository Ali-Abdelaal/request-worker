const constants = require('../constants');

var zmq = require('zmq')
    , winston = require('winston');

var worker = exports;

worker.socket = zmq.socket(constants.zmq.socketType.rep);

worker.resolver = require('target-resolver');

/**
 * @description Initiate client socket
 * @param address the ip that the socket should connect on it, like 'tcp://127.0.0.1:3000'
 */
worker.init = function (address) {
    try {
        worker.socket.connect(address);
    }
    catch (error) {
        winston.log('info', error);
        throw new Error("Fail to connect " + address);
    }
    winston.log("info", 'Worker connected to %s', address);
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

/**
 * @description send reply to the server for spesific request
 * @param reply : the sting json object of target and isUp
 */
worker.sendReply = function (reply) {
    // Send the message back aa a reply to the server.
    worker.socket.send(reply);
}

/**
 * @description handle the server request 
 * by resolve the target and send reply by target status
 * @param req : the request form the server
 */
worker.handleRequest = function (req) {
    var request = JSON.parse(req);
    winston.log("info", 'The reqested target is: %s', request.target);

    worker.resolver.resolve(
        request.target, request.resolveType, function (result) {
            var reply = worker.buildReply(request.target, result);
            worker.sendReply(reply);
        });
};

worker.socket.on('message', function (req) {
    worker.handleRequest(req);
});
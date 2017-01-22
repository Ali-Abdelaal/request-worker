const constants = require('../constants');

var zmq = require('zmq')
    , _socket = zmq.socket(constants.zmq.socketType.rep)
    , targetResolver = require('target-resolver')
    , winston = require('winston');

var worker = exports;

/**
 * @description Initiate client socket
 */
worker.init = function () {
    _socket.connect('tcp://127.0.0.1:3000');
    winston.log("info", 'Worker connected to port 3000');
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
    _socket.send(reply);
}

/**
 * @description handle the server request 
 * by resolve the target and send reply by target status
 * @param req : the request form the server
 */
worker.handleRequest = function (req) {
    var request = JSON.parse(req);
    winston.log("info", 'The reqested target is: %s', request.target);

    targetResolver.resolve(
        request.target, request.resolveType, function (result) {
            var reply = worker.buildReply(request.target, result);
            worker.sendReply(reply);
        });
};

_socket.on('message', function (req) {
    worker.handleRequest(req);
});
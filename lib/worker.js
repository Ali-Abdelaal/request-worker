const constants = require('./constants');

var zmq = require('zmq')
    , _socket = zmq.socket(constants.zmq.socketType.rep)
    , winston = require('winston');

var worker = exports;

worker.init = function () {
    _socket.connect('tcp://127.0.0.1:3000');
    console.log('Worker connected to port 3000');
};

worker.sendReply = function (reply) {
    // Send the message back aa a reply to the server.
    _socket.send("Response to %s " + reply);
}

worker.handleRequest = function (request) {
    console.log('work: %s', request.toString());

    //TODO: resolve request

    //TODO: send result in mq
    var reply = "REP TO:" + request;
    worker.sendReply(reply);

};

_socket.on('message', function (request) {
    worker.handleRequest(request);
});
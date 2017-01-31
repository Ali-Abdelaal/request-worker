describe("worker module", function () {

    var mock = {};
    mock.socket = (function () {
        var obj = function () { };

        obj.prototype.connect = function (bindingTarget) { };

        obj.prototype.send = function (address, type) { };

        return obj;
    })();

    mock.resolver = (function () {
        var obj = function () { };

        obj.prototype.resolve = function (address, type, callback) { };

        return obj;
    })();

    const _constants = require('../../../constants');
    var _zmq = require('zmq')
        , _winston = require('winston')
        , _worker = require('../../../lib/zeromq/worker');

    var worker,
        zmq,
        winston,
        constants;

    beforeEach(function () {
        worker = _worker;
        worker.socket = new mock.socket();
        worker.resolver = new mock.resolver();
        zmq = _zmq;
        winston = _winston;
        constants = _constants;
    });

    it('should be exist', function () {
        expect(!!worker).toBe(true);
    });

    describe("init function", function () {
        it('should be exist', function () {
            expect(!!worker.init).toBe(true);
        });

        it('should bind the adrress', function () {
            spyOn(worker.socket, 'connect');
            worker.init("adrress");
            expect(worker.socket.connect).toHaveBeenCalled();
        });
    });

    describe("buildReply function", function () {
        it('should be exist', function () {
            expect(!!worker.buildReply).toBe(true);
        });

        it('should build valid reply', function () {
            var expectedResult = JSON.stringify({
                target: 'target',
                isUp: true
            });

            var result = worker.buildReply('target', true);

            expect(result).toEqual(expectedResult);
        });
    });

    describe("sendReply function", function () {
        it('should be exist', function () {
            expect(!!worker.sendReply).toBe(true);
        });

        it('should call socket.send', function () {
            spyOn(worker.socket, 'send');
            worker.sendReply("request");
            expect(worker.socket.send).toHaveBeenCalled();
        });
    });

    describe("handleRequest function", function () {
        it('should be exist', function () {
            expect(!!worker.handleRequest).toBe(true);
        });

        it('should be handle the request', function () {
            var request = JSON.stringify({
                target: 'target',
                resolveType: 'type'
            });
            spyOn(worker.resolver, 'resolve');
            worker.handleRequest(request);
            expect(worker.resolver.resolve).toHaveBeenCalled();
        });
    });

});
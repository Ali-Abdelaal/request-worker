describe("rabbitmq worker module", function () {
    var mock = {};

    mock.resolver = (function () {
        var obj = function () { };

        obj.prototype.resolve = function (address, type, callback) { };

        return obj;
    })();

    const _constants = require('../../../constants');
    var _rabbitmq = require('amqplib')
        , _winston = require('winston')
        , _worker = require('../../../lib/rabbitmq/worker');

    var worker,
        rabbitmq,
        winston,
        constants;

    beforeEach(function () {
        worker = _worker;
        worker.resolver = new mock.resolver();
        rabbitmq = _rabbitmq;
        winston = _winston;
        constants = _constants;
    });

    it('should be exist', function () {
        expect(!!worker).toBe(true);
    });

    describe("init function", function () {
        it('should be exist', function () {
            expect(!!worker.init).toBe(true);
            expect(!!worker.amqp).toBe(true);
        });

        it('should be initalize worker', function () {
            var address = 'amqp://localhost';
            spyOn(worker.amqp, 'connect');
            worker.init(address);
            expect(worker.address).toEqual(address);
            expect(worker.amqp.connect).toHaveBeenCalled();
        });
    });

    describe("onServerConnected function", function () {
        it('should be exist', function () {
            expect(!!worker.onServerConnected).toBe(true);
        });

        it('should handle success', function () {
            var conn = {
                createChannel: function (callback) {
                }
            };
            spyOn(conn, 'createChannel');
            worker.onServerConnected(undefined, conn);
            expect(conn.createChannel).toHaveBeenCalled();
        });

        it('should handle error', function () {
            expect(function () {
                worker.onServerConnected('error', undefined);
            }).toThrow();
        });
    });

    describe("onChannelCreated function", function () {
        it('should be exist', function () {
            expect(!!worker.onChannelCreated).toBe(true);
        });

        it('should handle success', function () {
            var channel = {
                assertQueue: function (queueType, options) {
                },
                consume: function (name, callback, options) {
                },
                prefetch: function (number) {

                }
            };

            worker.onChannelCreated(undefined, channel);
            expect(worker.channel).toBe(channel);

            spyOn(worker.channel, 'assertQueue').and.callThrough();
            spyOn(worker.channel, 'consume');
            worker.onChannelCreated(undefined, channel);
            expect(worker.channel.assertQueue).toHaveBeenCalled();
            expect(worker.channel.assertQueue).toHaveBeenCalled();
        });

        it('should handle error', function () {
            expect(function () {
                worker.onChannelCreated('error', undefined);
            }).toThrow();
        });
    });

    describe("handleRequest function", function () {
        it('should be exist', function () {
            expect(!!worker.handleRequest).toBe(true);
        });

        it('should be handle the request', function () {
            var requestString = JSON.stringify({
                target: 'target',
                resolveType: 'type'
            });

            var request = {
                content: {
                    toString: function () {
                        return requestString;
                    }
                }
            };

            spyOn(worker.resolver, 'resolve');
            worker.handleRequest(request);
            expect(worker.resolver.resolve).toHaveBeenCalled();
        });
    });

    describe("buildReply function", function () {
        it('should be exist', function () {
            expect(!!worker.buildReply).toBe(true);
        });

        it('should be build valid reply', function () {
            var resultObj = {
                target: 'target',
                isUp: 'isUp'
            };

            var expectedResult = JSON.stringify(resultObj);

            var result = worker.buildReply('target', 'isUp');
            expect(result).toEqual(expectedResult);
        });
    });

});
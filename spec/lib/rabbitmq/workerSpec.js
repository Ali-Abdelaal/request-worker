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
        });
    });

});
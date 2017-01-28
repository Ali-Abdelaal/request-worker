describe("worker module", function () {
    const _constants = require('../../../lib/constants');
    var _zmq = require('zmq')
        , _winston = require('winston')
        , _worker = require('../../../lib/zeromq/worker');

    var worker,
        zmq,
        winston,
        constants;

    beforeEach(function () {
        worker = _worker;
        zmq = _zmq;
        winston = _winston;
        constants = _constants;
    });

    it('should be exist', function () {
        expect(!!worker).toBe(true);
    });

});
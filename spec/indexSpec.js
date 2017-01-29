describe("Index module", function () {
    process.env.MQ_ADDRESS = "tcp://127.0.0.1:3000";

    var mock = {};
    mock.worker = (function () {
        var obj = function () { };

        obj.prototype.init = function (address) { };

        return obj;
    })();

    const _constants = require('../lib/constants');
    var _index = require('../index');

    var index,
        constants;

    beforeEach(function () {
        index = _index;
        index.worker = new mock.worker();
        constants = _constants;
    });

    it('should be exist', function () {
        expect(!!index).toBe(true);
    });

    describe('init function', function () {
        it('should be exist', function () {
            expect(!!index.init).toBe(true);
        });

        it('should be init worker mq', function () {
            spyOn(index.worker, 'init');
            index.init();
            expect(index.worker.init).toHaveBeenCalled();
        });

        it('should handle MQ_ADDRESS not exists error', function () {
            process.env.MQ_ADDRESS = undefined;
            // IT ALSO Call worker.init ??

            spyOn(process, 'exit').and.callThrough();
            index.init();
            expect(process.exit).toHaveBeenCalled();
        });
    });

});
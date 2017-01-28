describe("Index module", function () {
    process.env.bindingTarget = "tcp://127.0.0.1:3000";
    const _constants = require('../lib/constants');
    var _index = require('../index'),
        _worker = require('../lib/zeromq/worker');

    var index,
        worker,
        constants;


    beforeEach(function () {
        index = _index;
        worker = _worker;
        constants = _constants;
    });

    it('should be exist', function () {
        expect(!!index).toBe(true);
    });

    describe('init function', function () {
        it('should be exist', function () {
            expect(!!index.init).toBe(true);
        });

        it('should be init producer mq', function () {
            spyOn(worker, 'init');
            index.init();
            expect(worker.init).toHaveBeenCalled();
        });
    });

});
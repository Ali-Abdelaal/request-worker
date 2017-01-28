var worker = require('./lib/zeromq/worker');

var index = exports;

index.init = function () {
  var bindingTarget = process.env.bindingTarget;
  if (!bindingTarget) {
    throw new Error("Please spesify your binding target via bindingTarget environment variable");
  }

  worker.init(bindingTarget);
};

index.init();
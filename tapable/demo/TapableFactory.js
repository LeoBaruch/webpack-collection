const {
  SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
} = require('tapable');

class TapableFactory {
  constructor() {
    this.hooks = {
      syncHook: new SyncHook(['arg1', 'arg2']),
      syncBailHook: new SyncBailHook(['arg1', 'arg2']),
      syncWaterfallHook: new SyncWaterfallHook(['arg1', 'arg2']),
      syncLoopHook: new SyncLoopHook(['arg1', 'arg2']),
      asyncSeriesHook: new AsyncSeriesHook(['arg1', 'arg2']),
      asyncSeriesBailHook: new AsyncSeriesBailHook(['arg1', 'arg2']),
      asyncSeriesWaterfallHook: new AsyncSeriesWaterfallHook(['arg1', 'arg2']),
      asyncParallelHook: new AsyncParallelHook(['arg1', 'arg2']),
      asyncParallelBailHook: new AsyncParallelBailHook(['arg1', 'arg2']),
    }
  }
  
}

module.exports = TapableFactory;
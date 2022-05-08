const TapableFactory =  require('./TapableFactory');

const tapable = new TapableFactory();

// ------------------ SyncHook ------------------
// 最基础的同步钩子：


const syncHook = tapable.hooks.syncHook;

// 注册事件
syncHook.tap('flag1', (arg1,arg2) => {
  console.log('flag1:',arg1,arg2)
  throw new Error('ss')
})

syncHook.tap('flag2', (arg1,arg2) => {
  console.log('flag2:',arg1,arg2)
})

// 调用事件并传递执行参数
syncHook.call('p1','p2')



// ------------------ SyncBailHook ------------------
// 如果任何事件函数存在返回值(非undefined)，那么会立即中断后续事件函数的调用
// return 1时: 返回 flag1: p1 p2
// 注掉return 1时: 返回:
// flag1: p1 p2
// flag2: p1 p2


// const syncBailHook = tapable.hooks.syncBailHook;

// // 注册事件
// syncBailHook.tap('flag1', (arg1,arg2) => {
//   console.log('flag1:',arg1,arg2)

//   // return 1
// })

// syncBailHook.tap('flag2', (arg1,arg2) => {
//   console.log('flag2:',arg1,arg2)
// })

// // 调用事件并传递执行参数
// syncBailHook.call('p1','p2')



// ------------------ SyncWaterfallHook ------------------
// 若上一个函数的存在返回值(非undefined)丶则会传递给下一个函数第一个参数
// 注掉return 1时: 返回:
// flag1: p1 p2
// flag2: p1 p2
// return 1时: (flag2中: ‘p1’被返回值‘1’替换)返回 
// flag1: p1 p2
// flag2: 1 p2 

// const syncWaterfallHook = tapable.hooks.syncWaterfallHook;

// // 注册事件
// syncWaterfallHook.tap('flag1', (arg1,arg2) => {
//   console.log('flag1:',arg1,arg2)

//   // return 1
// })

// syncWaterfallHook.tap('flag2', (arg1,arg2) => {
//   console.log('flag2:',arg1,arg2)
// })

// // 调用事件并传递执行参数
// syncWaterfallHook.call('p1','p2')



// ------------------ SyncLoopHook ------------------
// 若上一个函数的存在返回值(非undefined),则会重新从第一个监听函数开始执行
// 输出:
// flag1
// flag1
// flag2
// flag1
// flag2


// let flag1 = 2;
// let flag2 = 1;
// const syncLoopHook = tapable.hooks.syncLoopHook;

// syncLoopHook.tap('flag1', (arg1, arg2) => {
//   console.log('flag1');
//   if (flag1 !== 3) {
//     return flag1++;
//   }
// });

// syncLoopHook.tap('flag2', (arg1, arg2) => {
//   console.log('flag2');
//   if (flag2 !== 2) {
//     return flag2++;
//   }
// });

// syncLoopHook.call('p1', 'p2');



// ------------------ AsyncSeriesHook ------------------
// 异步串联执行
// flag1: p1 p2
// flag2: p1 p2(一秒后输出)
// 全部执行完毕 done
// timer: 2.018s


// const asyncSeriesHook = tapable.hooks.asyncSeriesHook;
// console.time('timer');
// // 注册事件
// asyncSeriesHook.tapPromise('flag1', (arg1, arg2) => {
//   console.log('flag1:', arg1, arg2);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve();
//       // reject(1)
//     }, 1000);
//   });
// });

// asyncSeriesHook.tapAsync('flag2', (arg1, arg2, callback) => {
//   console.log('flag2:', arg1, arg2);
//   setTimeout(() => {
//     callback();
//   }, 1000);
// });

// // 调用事件并传递执行参数
// asyncSeriesHook.callAsync('p1', 'p2', () => {
//   console.log('全部执行完毕 done');
//   console.timeEnd('timer');
// });



// ------------------ asyncSeriesBailHook ------------------
// 异步串联熔断执行 (机制和同步类似,resolve非undefined和reject都会阻止下一个执行)
// 输出
// flag1: p1 p2
// 全部执行完毕 done
// timer: 1.016s


// const asyncSeriesBailHook = tapable.hooks.asyncSeriesBailHook;
// console.time('timer');
// // 注册事件
// asyncSeriesBailHook.tapPromise('flag1', (arg1, arg2) => {
//   console.log('flag1:', arg1, arg2);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(1);
//       // reject()
//     }, 1000);
//   });
// });

// // 不执行
// asyncSeriesBailHook.tapPromise('flag2', (arg1, arg2) => {
//   console.log('flag2:', arg1, arg2);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve();
//     }, 1000);
//   });
// });

// // 调用事件并传递执行参数
// asyncSeriesBailHook.callAsync('p1', 'p2', () => {
//   console.log('全部执行完毕 done');
//   console.timeEnd('timer');
// });



// ------------------ asyncSeriesBailHook ------------------
// 异步串行瀑布钩子(同样和同步瀑布类似, resovle非undefined的值会返回下一个回调的第一个参数)
// 输出 (一秒后flag2, 第一个参数被替换)
// flag1: p1 p2
// flag2: 1 p2
// 全部执行完毕 done
// timer: 2.017s


// const asyncSeriesWaterfallHook = tapable.hooks.asyncSeriesWaterfallHook;
// console.time('timer');
// // 注册事件
// asyncSeriesWaterfallHook.tapPromise('flag1', (arg1, arg2) => {
//   console.log('flag1:', arg1, arg2);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(1);
//     }, 1000);
//   });
// });

// asyncSeriesWaterfallHook.tapPromise('flag2', (arg1, arg2) => {
//   console.log('flag2:', arg1, arg2);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve();
//     }, 1000);
//   });
// });

// // 调用事件并传递执行参数
// asyncSeriesWaterfallHook.callAsync('p1', 'p2', () => {
//   console.log('全部执行完毕 done');
//   console.timeEnd('timer');
// });

// ------------------ asyncParallelHook  ------------------
// 异步并行钩子，会并发执行所有异步钩子
// 最终结束仅需一秒,输出
// flag1: p1 p2
// flag2: p1 p2
// 全部执行完毕 done
// timer: 1.011s


// const asyncParallelHook = tapable.hooks.asyncParallelHook;
// console.time('timer');
// // 注册事件
// asyncParallelHook.tapPromise('flag1', (arg1, arg2) => {
//   console.log('flag1:', arg1, arg2);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve();
//     }, 1000);
//   });
// });

// asyncParallelHook.tapPromise('flag2', (arg1, arg2) => {
//   console.log('flag2:', arg1, arg2);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve();
//     }, 1000);
//   });
// });

// // 调用事件并传递执行参数
// asyncParallelHook.callAsync('p1', 'p2', () => {
//   console.log('全部执行完毕 done');
//   console.timeEnd('timer');
// });



// ------------------ asyncParallelBailHook  ------------------
// 异步并行保险钩子
// 输出 (resolve非undefined后, 会进入callAsynce回调, 然后因为并行,其实flag2已经启动,所以flag2 done之后输出)
// flag1: p1 p2
// flag2: p1 p2
// 全部执行完毕 done
// timer: 1.011s
// flag2 done: p1 p2



// const asyncParallelBailHook = tapable.hooks.asyncParallelBailHook;
// console.time('timer');
// // 注册事件
// asyncParallelBailHook.tapPromise('flag1', (arg1, arg2) => {
//   console.log('flag1:', arg1, arg2);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(true);
//     }, 1000);
//   });
// });

// asyncParallelBailHook.tapPromise('flag2', (arg1, arg2) => {
//   console.log('flag2:', arg1, arg2);
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log('flag2 done:', arg1, arg2);

//       resolve();
//     }, 1000);
//   });
// });

// // 调用事件并传递执行参数
// asyncParallelBailHook.callAsync('p1', 'p2', () => {
//   console.log('全部执行完毕 done');
//   console.timeEnd('timer');
// });




// 拦截器

// syncHook.intercept({
//   // 每次调用 hook 实例的 tap() 方法注册回调函数时, 都会调用该方法,
//   // 并且接受 tap 作为参数, 还可以对 tap 进行修改;
//   register: (tapInfo) => {
//     console.log(`${tapInfo.name} is register its job`);
//     return {...tapInfo, name: '22'}; // may return a new tapInfo object
//   },
//   // 通过hook实例对象上的call方法时候触发拦截器
//   call: (arg1, arg2) => {
//     console.log('Starting to call');
//   },
//   // 在调用被注册的每一个事件函数之前执行
//   tap: (tap) => {
//     console.log(tap, 'tap');
//   },
//   // loop类型钩子中 每个事件函数被调用前触发该拦截器方法
//   loop: (...args) => {
//     console.log(args, 'loop');
//   },
// });
// 自己封装一个Promise
// by 诡锋
// Bilibili: -诡锋丿Lavafall-

/*
注意：在JS函数中，可以写类似于Java的类 (貌似是ES6新特性)

如果要用构造函数的形式封装：
1. 如果你要在一个对象实例化以后的实例上挂上通用的方法，则放在对象的原型上  Promise.prototype.xxx
2. 如果你要在对象本身上加方法，不要挂在原型上，直接挂在自身身上即可 Promise.xxx
例如：
Promise.prototype.then = function (onResolved,onRejected)
Promise.resolve = function(value)

如果要用类的形式封装：
1. JS类中定义的函数，会被挂在原型对象上
2. JS类中定义的静态（static）函数，和Java一样，不会挂在原型上，使用类名.函数名()调用

*/


//以下采用类封装
class Promise{
    //构造器（构造函数)
   constructor(executor) {
       //添加属性
       this.PromiseState = 'pending';
       this.PromiseResult = undefined;
       //声明存入回调的对象数组（说人话就是数组里面每一个值都是对象）
       this.callbacks = [];

       //resolve函数
       const resolve = (data) => {
           //判断状态是否是pending，如果不是，就不允许修改了
           if(this.PromiseState !== 'pending') return;
           //1. 修改对象状态 (PromiseState)
           this.PromiseState = 'fulfilled'; //resolved 成功
           //2. 设置对象结果值 (PromiseResult)
           this.PromiseResult = data;
           //调用成功的回调函数
           setTimeout(() => {
               this.callbacks.forEach(item => {
                   //调用每一个成功的回调
                   item.onResolved(data);
               });
           })
       }
       //reject函数
       const reject = (data) => {
           //判断状态是否是pending，如果不是，就不允许修改了
           if(this.PromiseState !== 'pending') return;
           //1. 修改对象状态 (PromiseState)
           this.PromiseState = 'rejected'; //失败
           //2. 设置对象结果值 (PromiseResult)
           this.PromiseResult = data;
           //调用失败的回调函数
           setTimeout(() => {
               this.callbacks.forEach(item => {
                   //调用每一个失败的回调
                   item.onRejected(data);
               });
           });
       }
       try {
           //执行器函数是同步调用的
           executor(resolve, reject);
       }catch(e){
           //修改 Promise 对象的状态为失败
           reject(e);
       }
   }

    //添加 then 方法, 这个方法要是异步的
   then(onResolved,onRejected){
       // 判断回调函数参数是不是function类型, 如果没有传onRejected，它是undefined
       // 这是为了处理没有写onRejected,也就是reason这个函数的情况
       // 同时抛出错误可以改变该then的状态为失败，解决异常穿透(catch兜底)的问题
       if( typeof(onRejected) !== 'function' ){
           onRejected = reason => {
               throw reason;
           }
       }
       //如果第一个函数onResolved， 也就是value也没传，那么就默认加一个成功的回调，把上一个Promise传入的值直接返回
       if( typeof(onResolved) !== 'function' ){
           onResolved = value => value
       }
       return new Promise((resolve,reject) => {
           //封装函数
           const callback = (type) => {
               try {
                   //获取回调函数的执行结果
                   let result = type(this.PromiseResult);
                   //结果是Promise类型吗
                   if(result instanceof Promise){
                       //如果是 Promise 类型的对象
                       result.then(
                           value =>{
                               resolve(value);
                           },
                           reason => {
                               reject(reason);
                           }
                       )
                   }
                   else{
                       //结果的对象状态为 成功
                       resolve(result);
                   }
               }catch (e){
                   reject(e);
               }
           }

           //调用回调函数  PromiseState成功时，调用onResolved，失败时，调用onRejected
           if (this.PromiseState === 'fulfilled') {
               //JS是单线程的，任务需要排队，当setTimeout时间为零，意味着
               //它会在同步任务进行完毕后的最早时间来运行

               /*
                究极重点：
                  这里使用setTimeout来做异步是不合理的，因为Promise在异步任务中属于微任务，
                  但是我又找不到啥合适的微任务来干这个事，就只能用宏任务代替了，还是我太菜。

                相关知识点：
                  异步任务分为宏任务和微任务.
                  宏任务：包括整体代码script(可以理解为外层同步代码)、setTimeout、setInterval、I/O操作、ui render
                  微任务：promise、object.observe、MutationObserver(监听DOM树的变化)

                  注意，这里用setTimeout来实现异步其实是不合理的，因为原生Promise是微任务，而setTimeout是宏任务
                  任务进入队列的顺序： 先执行同步代码，遇到异步宏任务则将异步宏任务放入宏任务队列中，遇到异步微任务则将异步微任务放入微任务队列中
                  任务在同一线程中的执行顺序是： 同步任务 -> 异步微任务 -> 异步宏任务
              */
               setTimeout(() => {
                   callback(onResolved)
               })
           }
           if (this.PromiseState === 'rejected') {
               setTimeout(() => {
                   callback(onRejected)
               })
           }
           //如果是pending，则说明Promise里面的异步任务还没完成，状态还没改变
           if (this.PromiseState === 'pending') {
               //保存回调函数
               this.callbacks.push({
                   onResolved: () => {
                       //执行成功的回调函数
                       callback(onResolved)
                   },
                   onRejected: () => {
                       //执行失败的回调函数
                       callback(onRejected)
                   }
               })
           }
       });
   }

    // 添加 catch 方法
    // 在原生Promise中，catch是then(undefined,onRejected)的语法糖，所以直接这么干
    catch(onRejected){
        //then方法返回的是新的Promise对象
        return this.then(undefined,onRejected);
    }

    //添加 Promise.resolve 方法
    static resolve(value){
        //返回Promise对象
        return new Promise((resolve,reject) => {
            if(value instanceof Promise){
                value.then(
                    value => {
                        resolve(value);
                    },
                    reason => {
                        reject(reason);
                    }
                )
            }
            else {
                //传入的值不是Promise，则状态永远变成 成功
                resolve(value);
            }
        });
    }

    //添加 Promise.reject 方法
    //返回结果永远是失败的Promise, 失败的值就是reason
    //就算reason是一个成功的Promise, 最终这个reject也还是失败，只是失败的值是那个成功的Promise对象
    static reject(reason){
        return new Promise((resolve, reject) => {
            reject(reason);
        });
    }

    //添加 Promise.all 方法
    //参数 promises 是一个数组，如果数组中所有Promise都成功，则all返回一个成功的Promise实例，成功的值是它们成功的值的数组
    //如果一个Promise失败，则all返回一个失败的Promise实例，失败的值是里面失败的那个Promise的值
    //若有多个失败，返回第一个失败的值
    static all(promises){
        return new Promise((resolve, reject) => {
            //记录成功的个数
            let count = 0;
            //成功的Promise对象数组
            let arr = [];
            //遍历
            for(let i=0;i<promises.length;i++){
                promises[i].then(
                    value => {
                        //对象的状态是成功
                        //当每一个Promise对象都成功时，才能执行resolve()
                        count++;
                        //将当前 Promise 对象成功的结果存入到数组中
                        arr[i] = value;
                        //当成功个数等于数组长度：代表全都成功时
                        if(count === promises.length){
                            //修改状态
                            resolve(arr);
                        }
                    },
                    reason => {
                        reject(reason)
                    }
                )
            }
        })
    }

    //添加 Promise.race （赛跑）方法
    //参数 promises 是一个数组, 返回一个Promise实例
    //如果参数数组中谁先改变状态，则race返回的状态与它相同，值也是他的值
    static race(promises){
        return new Promise((resolve, reject) => {
            for(let i=0; i<promises.length; i++){
                promises[i].then(
                    value => {
                        //修改状态
                        resolve(value);
                    },
                    reason => {
                        reject(reason);
                    }
                )
            }
        });
    }
}
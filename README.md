# Web前端 - Promise学习笔记

## 作者：诡锋     B站： -诡锋丿Lavafall-

笔记对应的视频教程： https://www.bilibili.com/video/BV1GA411x7z1
如果想看手撸Promise的相关笔记，请看最后。

### Promise基本使用

Promise一般用于封装异步操作，解决多异步操作嵌套导致的回调地狱问题。

注意：Promise的参数是个函数，通常叫做Executor（执行器）函数，它会立即同步调用(启动里面代码块的操作，大多数都会放异步操作)，然后then方法就等Promise的状态改变后才被调用，所以then是异步的。

从用途来说，将Promise实例包裹异步操作以后，再封装成一个函数（函数返回该Promise实例)，可以使得该异步操作更容易复用，不用写出大量重复的代码，同时也可以直接对函数调用then方法，或者链式调用then解决多个异步操作嵌套的回调地狱。

### Promise的状态
状态：Promise实例对象中的一个属性  「PromiseState」

Promise共有三种状态
* pending 未决定的 (初始化时的默认状态)
* resolved / fulfilled 成功
* rejected 失败

Promise的状态改变
1. pending变为resolved
2. pending变为rejected

只有这两种，且一个Promise对象只能改变一次，无论变为成功还是失败，都会有一个结果数据，成功的结果数据一般称为value，失败的结果数据一般称为reason

### Promise对象的值
结果：Promise实例对象中的另一个属性 「PromiseResult」

保存着异步任务【成功/失败】的结果。

有两个函数可以修改这个值
* resolve
* reject

### Promise工作流程

![](https://cdn.jsdelivr.net/gh/Vincent-the-gamer/myPicBed/123.png)


### Promise的API
1. Promise 构造函数: Promise ( executor(){} ) 

(1) executor 函数: 执行器 (resolve, reject) => {} \
(2) resolve 函数: 内部定义成功时我们调用的函数 value => {} \
(3) reject 函数: 内部定义失败时我们调用的函数 reason => {}

说明: executor 会在 Promise 内部立即同步调用,异步操作在执行器中执行
2. Promise.prototype.then 方法: (onResolved, onRejected) => {}

   (1) onResolved 函数: 成功的回调函数 (value) => {} \
   (2) onRejected 函数: 失败的回调函数 (reason) => {}

   说明: 指定用于得到成功 value 的成功回调和用于得到失败 reason 的失败回调
   返回一个新的 promise 对象
3. Promise.prototype.catch 方法: (onRejected) => {} \
   (1) onRejected 函数: 失败的回调函数 (reason) => {} \
   说明: catch()是then()的语法糖, 相当于: then(undefined, onRejected)


### async/await
#### async
async修饰的函数返回值是一个Promise对象。 可以理解成Promise的语法糖， \
因为它也有以下特性:
* 如果返回值是一个非Promise的数据,结果就是成功的Promise对象,结果值就是这个数据
* 如果返回的是一个Promise对象, return的结果决定函数的状态
* 抛出异常: 返回失败的Promise, 失败值为抛出的内容

#### await
await一般用于拿到then的成功返回值。
1. await右侧的表达式一般是Promise对象，但也可以是其它值
2. 如果表达式是Promise对象，await返回的是Promise成功的值
3. 如果表达式是其它值，直接将此值作为await的返回值

注意：
* await必须写在 async 函数中，但async函数中不一定要有await
* 如果 await 的Promise失败了，就会抛出异常，需要通过try...catch捕获处理


### 手撸Promise
内容在public文件夹的promise.js里面

具体过程有空再更...
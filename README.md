# Web前端 - Promise学习笔记

## 作者：诡锋  B站： -诡锋丿Lavafall-

笔记对应的视频教程：(推荐第二个, 虽然我看完了第一个才发现第二个...) \
https://www.bilibili.com/video/BV1GA411x7z1  \
https://www.bilibili.com/video/BV1sU4y117YD   
 
如果想看我自己封装Promise的相关笔记，请看最后。

## 准备工作：前置知识点（有JS基础的就别看了）
### 函数对象和实例对象
1. 函数对象：将函数作为对象使用时，简称为函数对象
2. 实例对象： new 构造函数或类产生的对象, 我们称之为实例对象

### 回调函数的分类
回调：我们定义的函数，我们没有调用，最终执行了。

1. 同步的回调函数：
 理解：立即在主线程上执行，不会放入回调队列中
 例子：数组遍历相关的回调函数 / Promise的executor函数
2. 异步的回调函数：
 理解：不会立即执行，会放入回调队列中以后执行
 例子：定时器回调 / ajax回调 / Promise的成功，失败的回调


### JS中的错误(Error)和错误处理
1. 错误的类型
 * Error: 所有错误的父类型  类比Java的Exception
 * ReferenceError: 引用的变量不存在
 * TypeError: 数据类型不正确
 * RangeError: 数据值不在其所允许的范围内：超出最大回调栈 ---- 死循环，无限递归等
 * SyntaxError: 语法错误
2. 错误处理
 * 捕获错误： try{} catch(){}
 * 抛出错误： throw 'error' / throw new Error('error');
3. 错误对象
 * message属性： 错误相关信息
 * stack属性： 记录信息

## 正式学习Promise
### Promise是个啥？
抽象表达：
1. Promise是一门新的技术（ES6提出的特性)
2. Promise是JS中进行异步编程的新方案（旧方案是纯回调)

具体表达:
1. 从语法上来说： Promise是一个内置构造函数
2. 从功能上来说： Promise的实例对象可以用来封装一个异步操作，并可以获取其成功/失败的值

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
#### Promise 构造函数: Promise ( executor(){} ) 

(1) executor 函数: 执行器 (resolve, reject) => {} \
(2) resolve 函数: 内部定义成功时我们调用的函数 value => {} \
(3) reject 函数: 内部定义失败时我们调用的函数 reason => {}

说明: executor 会在 Promise 内部立即同步调用,异步操作在执行器中执行

#### Promise.prototype.then 方法: (onResolved, onRejected) => {}

   (1) onResolved 函数: 成功的回调函数 (value) => {} \
   (2) onRejected 函数: 失败的回调函数 (reason) => {}

Promise实例.then()返回的是一个【新的Promise实例】，它的值和状态由什么决定？

* 如果then所指定的回调返回的是非Promise值: a
  那么【新Promise实例】状态为： 成功(fulfilled), 成功的值是a
* 如果then所指定的回调返回的是一个Promise实例：p
  那么【新Promise实例】状态，值 都与p一致
* 如果then所指定的回调抛出异常：
  那么【新Promise实例】状态为：失败（rejected), reason为抛出的那个异常。

.then的链式调用：解决回调地狱问题

#### Promise.prototype.catch 方法: (onRejected) => {}
   (1) onRejected 函数: 失败的回调函数 (reason) => {} \
   说明: catch()是then()的语法糖, 相当于: then(undefined, onRejected)

### 中断Promise链
1. 当使用Promise的then链式调用是，在中间中断，不再调用后面的回调函数
2. 方法：在失败的回调函数中返回一个pending状态的Promise实例

典中典用法：
~~~js
  return new Promise(() => {})
~~~

### Promise错误穿透(catch兜底)
1. 当使用Promise的then链式调用时，可以在最后用catch指定一个失败的回调
2. 前面任何操作出了错误，都会传到最后失败的回调中处理
备注： 如果不存在then的链式调用，就不需要考虑then的错误穿透

原理：链式调用时不指定失败回调，但是Promise会悄悄的加一个
~~~js
 reason => {throw '失败的那个Promise的失败值'}
~~~
抛出错误会导致当前这个then返回是一个全新的失败的Promise,值为抛出的错误值
然后一直触发下一个then的错误的回调，一个一个把错误抛下去，直到catch兜底来
统一处理错误。

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


### 手撸Promise -- 自己封装
内容在public文件夹的promise.js里面

具体过程有空再更...
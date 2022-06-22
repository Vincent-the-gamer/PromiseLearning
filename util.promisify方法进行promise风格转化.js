//util.promisify方法

//引入util模块
const util = require('util')
//引入fs模块
const fs = require('fs');
//返回一个新的函数
let myReadFile = util.promisify(fs.readFile)

myReadFile('./public/content.txt').then(
    value => {
        console.log(value.toString())
    },
    reason => {
        console.log(reason)
    }
)
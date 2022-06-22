//引入fs文件读取模块
const fs = require('fs');

// 回调函数的形式
// fs.readFile('./public/content.txt', (err,data) => {
//     //如果出错，则抛出错误
//     if(err) throw err;
//     //输出文件内容
//     console.log(data.toString());
// })

//Promise形式
let p = new Promise((resolve, reject) => {
    fs.readFile('./public/content.txt', (err,data) => {
        //如果出错
        if(err) reject(err);
        //如果成功
        resolve(data);
    })
})


//调用 then
p.then(
    value => {
       console.log(value.toString());
    },
    reason => {
       console.log(reason);
    }
)

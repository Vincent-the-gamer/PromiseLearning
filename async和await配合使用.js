/*
  读取resources文件夹下的3个html文件, 拼接输出
*/
const fs = require('fs');
const util = require('util');
const myReadFile = util.promisify(fs.readFile)


//async 与 await 实现
async function main(){
    //读取文件的内容
    try {
        let data1 = await myReadFile('./resources/1.html');
        let data2 = await myReadFile('./resources/2.html');
        let data3 = await myReadFile('./resources/3.html');
        console.log(data1 + data2 + data3)
    }catch (e){
        console.log(e);
    }
}


main()
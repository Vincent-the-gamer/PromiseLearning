const express = require('express');
const app = new express();

app.use(express.static('./public'));
const port = 5000;
app.listen(port,() => {
    console.log("该应用运行于: "+"http://localhost:"+ port)
})
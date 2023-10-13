const path = require('path')
const app = require('./app')

global.appRoot = path.resolve(__dirname)
console.log(appRoot)
app.listen(8080,()=>{
    console.log("server is running on 127.0.0.1:8080")
})
const path = require('path')
const app = require('./app')

global.appRoot = path.resolve(__dirname)

const PORT = process.env.PORT || 3000
console.log(PORT)
app.listen(PORT,()=>{
    console.log("server is running on 127.0.0.1:3000")
})
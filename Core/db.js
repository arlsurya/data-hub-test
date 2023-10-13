
const mongoose = require('mongoose')
const uri = `mongodb://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`

module.exports = connectDB = ()=>{
    const connectionParams = {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
    mongoose.connect(uri, connectionParams)
   
    .then(()=>{
        console.log(`database is connected to ${process.env.DBHOST}:${process.env.DBPORT}`)
    })
    .catch((error)=>{
        console.log(error)
    })

}



// const mongoose = require('mongoose')

// module.exports = connectDB = ()=>{
//     mongoose.connect(`mongodb://${process.env.DBHOST}:${process.env.DBPORT}`,{
//         dbName: process.env.DBNAME
//     })
//     .then(()=>{
//         console.log(`database is connected to ${process.env.DBHOST}:${process.env.DBPORT}`)
//     })

// }
const mongoose = require('mongoose')
const uri = 'mongodb+srv://arlsurya:Fs9l3Qvt84rTlPNu@tejilo.ofcxiw4.mongodb.net/?retryWrites=true&w=majority'


module.exports = connectDB = ()=>{
    const connectionParams = {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
    mongoose.connect(uri, connectionParams)
   
    .then(()=>{
        console.log(`database is connected to ${process.env.DBHOST}:${process.env.DBPORT}`)
    })

}



// const { MongoClient } = require('mongodb')
// const uri = 'mongodb+srv://arlsurya:Fs9l3Qvt84rTlPNu@tejilo.ofcxiw4.mongodb.net/?retryWrites=true&w=majority'
// const client = new MongoClient(uri);

// async function connectToMongoDB() {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB Atlas');
//   } catch (error) {
//     console.error('Error connecting to MongoDB Atlas:', error);
//   }
// }

// // Export the MongoDB Atlas connection and connect function
// module.exports = {
//   client,
//   connectToMongoDB,
// };


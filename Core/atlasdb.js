
const mongoose = require('mongoose');
const atlasUrl = process.env.ATLASDBURL;

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const secondaryDB = mongoose.createConnection(atlasUrl, connectionParams);

secondaryDB.on('error', (error) => {
    console.error(`Secondary database connection error: ${error}`);
});

secondaryDB.once('open', () => {
    console.log(`Secondary database is connected to MongoDB Atlas`);
});

module.exports = { secondaryDB };

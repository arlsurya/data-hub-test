const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('./env');
const DB = require('./Core/db');
const indexRoutes = require('./Routes/index');
const apiRoutes = require('./Routes/api');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone'); // Import the moment-timezone library
const { secondaryDB } = require('./Core/atlasdb');

app.use(cors());
app.use(fileUpload());
DB();
app.disable("x-powered-by");
app.use(express.json());

// Set the Nepal time zone
const nepalTimeZone = 'Asia/Kathmandu';

// Create a custom token for the formatted date
morgan.token('nepal-time', (req, res, tz) => {
    return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
});

// Define a custom format that includes the Nepal time zone-formatted date
const customFormat = ':remote-addr - [:nepal-time[' + nepalTimeZone + ']] ":method :url" :status :response-time ms ":user-agent"';

// Create a write stream for the log file
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });


app.use(morgan(customFormat, {
    stream: accessLogStream
}));

// Create a middleware to save log data to the secondary MongoDB database
app.use((req, res, next) => {
    const responseTime = parseFloat(res.get('response-time'));

    const logData = {
        remoteAddr: req.ip,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        responseTime: responseTime,
        userAgent: req.get('user-agent'),
        timestamp: moment().tz(nepalTimeZone).format('YYYY-MM-DD HH:mm:ss')
    };

    // collection name accesslogs
    const secondaryCollection = secondaryDB.collection('accessLogs');
    secondaryCollection.insertOne(logData, (error, result) => {
        if (error) {
            console.error('Error saving log data to the secondary database:', error);
        } else {
            console.log('Log data saved to the secondary database:', result);
        }
    });

    next();
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

app.use('/', indexRoutes);
app.use('/api', apiRoutes);

module.exports = app;
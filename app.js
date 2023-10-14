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

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan(customFormat, {
    stream: accessLogStream
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

app.use('/', indexRoutes);
app.use('/api', apiRoutes);

module.exports = app;

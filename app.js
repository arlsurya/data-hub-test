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
const moment = require('moment-timezone');
const { secondaryDB } = require('./Core/atlasdb');
const cluster = require('cluster');
const os = require('os');

const numCPUs = os.cpus().length;

console.log("Total CPUs => " + numCPUs)
console.log("Process Id => " + process.pid)


if (cluster.isMaster) {
    // Create a cluster of worker processes
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        // Replace the terminated worker
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    // Worker code
    app.use(cors());
    app.use(fileUpload());
    DB();
    app.disable('x-powered-by');
    app.use(express.json());

    // Set the Nepal time zone
    const nepalTimeZone = 'Asia/Kathmandu';

    // Create a custom token for the formatted date
    morgan.token('nepal-time', (req, res, tz) => {
        return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
    });

    // Define a custom format that includes the Nepal time zone-formatted date
    const customFormat =
        ':remote-addr - [:nepal-time[' + nepalTimeZone + ']] ":method :url" :status :response-time ms ":user-agent"';

    // Create a write stream for the log file
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

    // Create a middleware to save log data to the secondary MongoDB database

    app.use((req, res, next) => {

        const responseTime = res.get('response-time')
        const responseTimeData = `${responseTime} ms`
        const logData = {
            remoteAddr: req.ip,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            responseTime: responseTimeData,
            userAgent: req.get('user-agent'),
            timestamp: moment().tz(nepalTimeZone).format('YYYY-MM-DD HH:mm:ss'),
        };

        // Collection name accesslogs
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

    app.use(morgan(customFormat, {
        stream: accessLogStream
    }));

    console.log('Worker started with PID => ' + process.pid);

    /* request rate limiter */
    // const limiter = rateLimit({
    //     windowMs: 15 * 60 * 1000,
    //     max: 100,
    // });

    app.use('/', indexRoutes);
    app.use('/api', apiRoutes);

    // Start the Express app on a specific port
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
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
const fs = require('fs')
const path = require('path')


app.use(cors());

app.use(fileUpload());
DB();

app.disable("x-powered-by");

app.use(express.json());

// Set up Morgan for request logging
morgan.token('remote-addr', (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
});

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
 
app.use(morgan(':remote-addr :method :url :status :response-time ms', {
    stream: accessLogStream
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

// app.use(limiter);

app.use('/', indexRoutes);
app.use('/api', apiRoutes);

module.exports = app;

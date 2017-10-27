const express = require('express');
const morgan = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const config = require('./config');

// DB Setup
mongoose.connect(config.database);

// App Setup
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json({ type: '*/*' }));

// Enable CORS from client-side
app.use((req, res, next) => {  
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// All routes go through router
router(app);

// Server Setup
const port = config.port;
const server = http.createServer(app);
server.listen(port);

console.log('Server listening on', port);
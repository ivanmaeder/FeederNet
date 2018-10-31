const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const mongoose = require('mongoose');

// Routes
const routes = require('./routes/index.js');

// Express instance
var app = express();

// Mongoose
mongoose.connect('mongodb://localhost/node-testing', (err, res) => {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database!');
  }
})

// Config middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Main routes
app.use('/', routes);

// Server configuration
var server = http.createServer(app);
server.listen(3000, () => {
    console.log('INFO: Server started.');
});

module.exports = app;

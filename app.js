const express = require('express');
const mysql = require('mysql');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

var mysqlConnection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT
});


mysqlConnection.connect(function(err) {
    if (err) {
        console.log("ERROR: Database connection failed: " + err.stack);
        return;
    }
    console.log("INFO: Connected to database.");
});

mysqlConnection.end();

app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/public'));

function saveHeartbeat(feederName) {

}

server.listen(app.get('port'), function() {
    console.log('Node version: ' + process.versions.node);
    console.log('Server listening on port ' + app.get('port'));
});

// Setup feeder namespace
var feederNsp = io.of('/feeders');

feederNsp.on('connection', function(socket) {
    console.log("INFO: New socket connection in feeder namespace.");

    socket.on('disconnect', function() {
        console.log("INFO: Socket with id " + socket.id + " disconnected.");
    })
});

io.on('connection', function(socket) {
    console.log("INFO: New socket connection opened.");

    socket.on('heartbeat', function(data) {
        console.log("INFO: Received heartbeat from feeder " + data.feederName);
        saveHeartbeat(data.feederName);
    });

    socket.on('newTrack', function(data) {
        console.log("INFO: Received new track event!");
    });
});

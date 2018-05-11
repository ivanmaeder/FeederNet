const express = require('express');
const mysql = require('mysql');
const http = require('http');
const async = require('async');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

var mysqlConnection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
});

// Connected feeder array
var connectedFeeders = new Array();

// Connect to MySQL database
mysqlConnection.connect(function(err) {
    if (err) {
        console.log("ERROR: Database connection failed: " + err.stack);
        return;
    }
    console.log("INFO: Connected to database.");
    mysqlConnection.query("SHOW TABLES", function (err, result) {
        if (err) {
            console.log("ERROR: Could not show tables.");
            console.log(err);
            return;
        }
        console.log(result);
    });
});


function logTrack(name, timedate, rfid) {
    var sql = "INSERT INTO log (feedername, timedate, rfid) VALUES(\"" + name + "\",\"" + timedate + "\",\"" + rfid + "\");";
    mysqlConnection.query(sql, function (err, result) {
        if (err) {
            console.log("ERROR: SQL insertion failed.");
            console.log(err);
            return;
        }
        console.log("INFO: Inserted: " + result.affectedRows);
    });
}

function getFeeders(socket) {
    var returnData = new Array();
    var getFeedersSQL = "SELECT * FROM feeders";
    mysqlConnection.query(getFeedersSQL, function (err, feederData) {
        if (err) {
            console.log("ERROR: Failed to get feeders.");
            console.log(err);
            return;
        }
        async.waterfall([
            constructDataObjects(feederData)
        ], function(err, dataArray) {
            socket.emit('updateFeeders', feederData);
        });

    });
}

function constructDataObjects(dataArray) {
    return function(callback) {
        for(var index = 0; index < dataArray.length; ++index) {
            async.waterfall([
                checkConnectionStatus(dataArray[index]),
                getLog
            ], function(err, data) {
                dataArray[index] = data;
                console.log("INFO: Data: ");
                console.log(dataArray[index]);
            });
        }
        callback(null, dataArray);
    }
}

function checkConnectionStatus(data) {
    return function(callback) {
        console.log("INFO: Feeder name: " + data.feedername);
        // Insert connection status
        data.connectionStatus = "Offline";
        for(var connIndex in connectedFeeders) {
            if (data.feedername == connectedFeeders[connIndex].feederName) {
                data.connectionStatus = "Offline";
                break;
            }
        }
        callback(null, data);
    }
}

function getLog(data, callback) {
    return function(callback) {
        // Get individual feeder's logs.
        mysqlConnection.query("SELECT * FROM log WHERE feedername='" +
            data.feedername + "'", function (err, feederLogs)
        {
            if (err) {
                console.log("ERROR: Failed to get feeder logs.");
                console.log(err);
            }
            else {
                data.recentLog = new Array();
                for (var logIndex = 0; logIndex < feederLogs.length; ++logIndex) {
                    data.recentLog.push({timedate: data.timedate});
                }
                callback(err, data);
            }
        });
    }
}

// Express setup
app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/public'));

// Server setup
server.listen(app.get('port'), function() {
    console.log('Node version: ' + process.versions.node);
    console.log('Server listening on port ' + app.get('port'));
});

// Socket events
io.on('connection', function(socket) {
    console.log("INFO: New socket connection opened.");

    // Emit an ID request to the current socket to see if it's a feeder.
    socket.emit('idRequest', " ");

    // Insert feeder data to database.
    socket.on('newTrack', function(data) {
        console.log("INFO: Received new track event from feeder " + data.feederName);
        console.log("INFO: Timestamp: " + data.timedate + " | " + "RFID: " + data.rfid);
        logTrack(data.feederName, data.timedate, data.rfid);
    });

    // Receive new feeder's ID.
    socket.on('idTransmit', function(data) {
        console.log("INFO: Received new feeder ID " + data.feederName);
        connectedFeeders.push({feederName: data.feederName, socketID: socket.id});
        console.log("INFO: Associated " + data.feederName + " with ID " + socket.id);
    });

    // Get list of feeders
    socket.on('getFeeders', function(data) {
        console.log("INFO: Requested feeder list");
        getFeeders(socket);
    });

    // Detect disconnected feeder.
    socket.on('disconnect', function() {
        console.log("INFO: Socket disconnected. Socket ID: " + socket.id);
        for (var key in connectedFeeders) {
            if (connectedFeeders[key].socketID == socket.id) {
                console.log("INFO: Feeder " + connectedFeeders[key].feederName + " disconnected.");
                connectedFeeders.splice(key, 1);
            }
        }
    });
});

var express = require('express');
var mysql = require('mysql');
var http = require('http');
var async = require('async');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var mysql_pool = mysql.createPool({
    connectionLimit: 3,
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
});

// Connected feeder array
var connectedFeeders = [];

// Connect to MySQL database and read tables
mysql_pool.getConnection(function(err, connection) {
    connection.query("SHOW TABLES", function (err, result) {
        if (err) {
            console.log("ERROR: Could not show tables.");
            console.log(err);
            return;
        }
        console.log(result);
    });
    connection.release();
});

// Insert new track into database
function logTrack(name, timedate, rfid) {
    var sql = "INSERT INTO log (feedername, timedate, rfid) VALUES(\"" + name + "\",\"" + timedate + "\",\"" + rfid + "\");";
    mysql_pool.getConnection(function(err, connection) {
        connection.query(sql, function (err, result) {
            if (err) {
                console.log("ERROR: SQL insertion failed.");
                console.log(err);
                return;
            }
            console.log("INFO: Inserted: " + result.affectedRows);
        });
        connection.release();
    });
}

function getFeeders(socket) {
    async.waterfall([
        function (callback) {
            // Get feeder table from database.
            var getFeedersSQL = "SELECT * FROM feeders";
            mysql_pool.getConnection(function(err, connection) {
                connection.query(getFeedersSQL, function (dberr, feederData) {
                    if (dberr) {
                        console.log("ERROR: Failed to get feeders.");
                        console.log(dberr);
                    }
                    console.log("INFO: Retrieved feeder data from database.");
                    callback(dberr, feederData);
                });
                connection.release();
            });
        },
        function (data, callback) {
            // Check feeder connection.
            for (let index in data) {
                data[index].connectionStatus = "Offline";
                for(var connIndex in connectedFeeders) {
                    if (data[index].feedername == connectedFeeders[connIndex].feederName) {
                        data[index].connectionStatus = "Online";
                        break;
                    }
                }
                if (index == data.length - 1) {
                    console.log("INFO: Processed connection statuses.");
                    callback(null, data);
                }
            }
        },
        function (data, callback) {
            // Get feeder logs
            for (let index in data) {

                mysql_pool.getConnection(function(err, connection) {
                    connection.query("SELECT * FROM log WHERE feedername='" +
                    data[index].feedername + "' ORDER BY id DESC", function (dberr, feederLogs)
                    {
                        if (dberr) {
                            console.log("ERROR: Failed to get feeder logs.");
                            console.log(dberr);
                            callback(dberr, data);
                        }
                        else {
                            data[index].recentLog = [];
                            for (var logIndex = 0; logIndex < feederLogs.length; ++logIndex) {
                                console.log("INFO: Feeder " + data[index].feedername + " log: " +
                                feederLogs[logIndex].timedate);
                                data[index].recentLog.push({timedate: feederLogs[logIndex].timedate, rfid: feederLogs[logIndex].rfid});
                            }
                            if (index == data.length - 1) {
                                console.log("INFO: Processed feeder logs.");
                                callback(null, data);
                            }
                        }
                    });
                    connection.release();
                });
            }
        },
        function (data, callback) {
            socket.emit('updateFeeders', data);
            console.log("INFO: Resulting data object: ");
            console.log(data);
            callback(null, data);
        }
    ], function (err) {
        if (err) {
            console.log("ERROR: Waterfall failed.");
            console.log(err);
        }
    });

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

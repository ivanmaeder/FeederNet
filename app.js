const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + '/public'));

server.listen(app.get('port'), function() {
    console.log('Node version: ' + process.versions.node);
    console.log('Server listening on port ' + app.get('port'));
});

io.on('connection', function(socket) {
    console.log("INFO: New socket connection opened.");

    socket.on('heartbeat', function(data) {
        console.log("INFO: Received heartbeat with data: ");
        console.log(data);
    });
});

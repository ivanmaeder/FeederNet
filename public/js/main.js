var socket;
var map;
var markers = [];

/*
Popup display

- Name of feeder
- Online / offline
- Recent logs

json data Array

 - feedername
 - lat
 - lon
 - connectionStatus
 - logs

*/

$(document).ready(function() {
    socket = io.connect();
    setupMap();
    getFeeders();
    requestData();


    socket.on('updateFeeders', function(msg) {
        insertMarkers(msg);
    });
});

function setupMap() {
    map = L.map('map').setView([51.4735455, -0.038564], 17);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 19,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiaW50ZXJhY3Rpb25yZXNlYXJjaHN0dWRpbyIsImEiOiJjamdwcXd1bTMwMmNpMnhwZWU1NTRibWg4In0.Z0N-6EZWHB1cawLd1Hz_2A'
    }).addTo(map);
}

function getFeeders() {
    socket.emit('getFeeders', ' ');
}

function requestData() {
    socket.emit('dataRequest', ' ');
}

function insertMarkers(data) {
    for(var index in data) {
        console.log("Feeder name: " + data[index].feedername + " | Lat: " + data[index].lat + " | Lon: " + data[index].lon);
        addMarker(data[index].lat, data[index].lon, data[index].feedername, data[index].connectionStatus, data[index].recentLog);
    }
    console.log(data);
}

function addMarker(lat, lon, feederName, connStatus, logs) {
    var marker = L.marker([parseFloat(lat), parseFloat(lon)]).addTo(map).on('click',
        onMarkerClick).bindPopup(getFormattedPopupContent(feederName, connStatus, logs));
    markers.push(marker);
}

function onMarkerClick(e) {

}

function updateMarkers(data) {

}

function getFormattedPopupContent(feederName, status, logs) {
    var colour;
    if (status == 'Online') colour = "green";
    else if (status == 'Offline') colour = "red";
    var content =
        '<b>Name</b><br>' + feederName + '<br><br>' +
        '<b>Status</b><br><span style="color: ' + colour + ';">' + status + '</span><br><br>' +
        '<b>Recent logs</b><br>';

    if (logs.length > 0) {
        for (var index in logs) {
            console.log("INFO: Timestamp: " + logs[index].timestamp);
            content += logs[index].timedate + ' ' + logs[index].birdname + '</b><br>';
        }
    }
    else {
        content += 'No tracks yet.';
    }

    return content;
}

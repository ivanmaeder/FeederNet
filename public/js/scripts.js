var socket;
var mapboxgl = require('../node_modules/mapbox-gl/dist/mapbox-gl.js');

$(document).ready(function() {
    socket = io();

    setupMap();
});

function setupMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaW50ZXJhY3Rpb25yZXNlYXJjaHN0dWRpbyIsImEiOiJjamdwcXd1bTMwMmNpMnhwZWU1NTRibWg4In0.Z0N-6EZWHB1cawLd1Hz_2A';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10'
    });
}

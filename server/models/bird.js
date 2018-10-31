var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var birdSchema = new Schema({
    rfid: String,
    name: String
});

module.exports = mongoose.model('birds', birdSchema);

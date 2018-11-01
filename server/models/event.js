var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    type: String,
    ip: String,
    datetime: String
});

module.exports = mongoose.model('event', eventSchema);

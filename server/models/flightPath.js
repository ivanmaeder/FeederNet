var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var flightPathSchema = new Schema({
    bird: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bird'
    },
    waypoints: [
        {
            feeder: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Feeder'
            },
            datetime: String
        }
    ]
});

flightPathSchema.methods.addBird = function(bird_id) {
    this.bird = bird_id;
    return this.save();
}

flightPathSchema.methods.addWaypoint = function(w) {
    this.waypoints.push(w);
    return this.save();
}

module.exports = mongoose.model('flightPath', flightPathSchema);

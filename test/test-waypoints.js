process.env.NODE_ENV = 'test';

// Load modules required for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// Load app and schemas
const server = require('../server/app');
const Bird = require('../server/models/bird');
const Feeder = require('../server/models/feeder');
const Waypoint = require('../server/models/waypoint');

// Setup chai
var should = chai.should();
chai.use(chaiHttp);

describe('Route - Waypoints', () => {

    beforeEach((done) => {
        // Create new bird
        var newBird = new Bird({
            rfid: 'bird-rfid-number',
            name: 'bird-name'
        });

        // Create new feeder
        var newFeeder = new Feeder({
            stub: 'feeder-stub',
            name: 'feeder-name',
            location: {
                latitude: '1.0000',
                longitude: '1.0000'
            },
            lastPing: 'never'
        });

        // Create new waypoint
        var newWaypoint = new Waypoint({
            datetime: 'test-date-time'
        });

        // Save data
        newBird.save((err, bird_data) => {
            newFeeder.save((err, feeder_data) => {
                newWaypoint.save((err, waypoint) => {
                    return waypoint.addBird(bird_data.id).then((_waypoint) => {
                        return _waypoint.addFeeder(feeder_data.id).then((__waypoint) => {
                            return done();
                        });
                    });
                });
            });
        });
        // newWaypoint.save((err) => {
        //     done();
        // });
    });

    afterEach((done) => {
        Waypoint.collection.drop();
        done();
    });

    it('should list all waypoints on /waypoints GET', (done) => {
        chai.request(server)
            .get('/api/waypoints')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('datetime');
                res.body[0].should.have.property('bird');
                res.body[0].should.have.property('feeder');
                res.body[0].datetime.should.equal('test-date-time');
                res.body[0].bird.should.be.a('object');
                res.body[0].bird.should.have.property('rfid');
                res.body[0].bird.should.have.property('name');
                res.body[0].feeder.should.be.a('object');
                res.body[0].feeder.should.have.property('stub');
                res.body[0].feeder.should.have.property('name');
                res.body[0].feeder.should.have.property('location');
                res.body[0].feeder.should.have.property('lastPing');
                done();
            });
    });
});

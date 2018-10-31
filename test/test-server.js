process.env.NODE_ENV = 'test';

// Load modules required for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// Load app and schemas
const server = require('../server/app');
const Bird = require('../server/models/bird');

// Setup chai
var should = chai.should();
chai.use(chaiHttp);

describe('Birds', () => {
    it('should list all birds on /birds GET', (done) => {
        chai.request(server)
            .get('/birds')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
    it('should list a single bird on /bird/<id> GET', (done) => {
        var newBird = new Bird({
            rfid: 'test-rfid-number',
            name: 'test-name'
        });
        newBird.save((err, data) => {
            chai.request(server)
                .get('/bird/'+data.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('rfid');
                    res.body.should.have.property('name');
                    res.body.rfid.should.equal('test-rfid-number');
                    res.body.name.should.equal('test-name');
                    res.body._id.should.equal(data.id);
                    done();
                });
        });
    });
    it('should add a single bird on /birds POST');
    it('should update a single bird on /bird/<id> PUT');
    it('should delete a single bird on /bird/<id> DELETE');
});

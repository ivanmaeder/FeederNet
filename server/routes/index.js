var express = require('express');
var router = express.Router();
var Bird = require('../models/bird');

router.get('/', (req, res, next) => {
    console.log('INFO: GET root.');
    res.send('Hello world.');
});

// API routes
router.get('/birds', findAllBirds);
router.get('/bird/:id', findBirdById);
router.post('/birds', addBird);
router.put('/bird/:id', updateBird);
router.delete('/bird/:id', deleteBird);

// Get all birds
function findAllBirds(req, res) {
    Bird.find((err, birds) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json(birds);
        }
    });
}

// Get single bird
function findBirdById(req, res) {
    Bird.findById(req.params.id, (err, bird) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json(bird);
        }
    });
}

// Add new bird
function addBird(req, res) {
    var newBird = new Bird({
        rfid: req.body.rfid,
        name: req.body.name
    });
    newBird.save((err) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            res.json({'SUCCESS': newBird});
        }
    });
}

// Update bird
function updateBird(req, res) {
    Bird.findById(req.params.id, (err, bird) => {
        bird.rfid = req.body.rfid;
        bird.name = req.body.name;
        bird.save((err) => {
            if (err) {
                res.json({'ERROR': err});
            } else {
                res.json({'UPDATED': bird});
            }
        });
    });
}

// Delete bird
function deleteBird(req, res) {
    Bird.findById(req.params.id, (err, bird) => {
        if (err) {
            res.json({'ERROR': err});
        } else {
            bird.remove((err) => {
                if (err) {
                    res.json({'ERROR': err});
                } else {
                    res.json({'REMOVED': bird});
                }
            });
        }
    });
}

module.exports = router;

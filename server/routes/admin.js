var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    console.log('INFO: GET admin.');
    res.sendFile(path.join('../../admin-client/build/index.html'));
});

module.exports = router;

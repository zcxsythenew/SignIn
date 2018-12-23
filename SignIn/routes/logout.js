'use strict';
var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    req.session.destroy();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("Logout OK.");
});

module.exports = router;

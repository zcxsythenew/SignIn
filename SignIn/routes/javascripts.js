'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET javascript. */
router.get('/', function (req, res) {
    fs.readFile("public/javascripts/index.js", (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("javascript not found");
        } else {
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(data.toString());
            res.end();
        }
    });
});

module.exports = router;

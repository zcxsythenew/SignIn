'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET image. */
router.get('/', function (req, res) {
    fs.readFile("public/images/background.png", "binary", (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("image not found");
        } else {
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.write(data, "binary");
            res.end();
        }
    });
});

module.exports = router;

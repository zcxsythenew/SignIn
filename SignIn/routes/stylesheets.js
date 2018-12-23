'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET CSS. */
router.get('/', function (req, res) {
    fs.readFile("public/stylesheets/main.css", (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("CSS file not found");
        } else {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data.toString());
            res.end();
        }
    });
});

module.exports = router;

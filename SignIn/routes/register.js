'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var storage_manager = require('../storage/storage');
var querystring = require('querystring');

/* GET register page. */
router.get('/', function (req, res) {
    fs.readFile("views/register.html", (err, data) => {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write("HELLO");
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data.toString());
            res.end();
        }
    });
});

router.post('/', function (req, res) {
    var post_body = querystring.parse(req.body);
    if (post_body.name && post_body.id && post_body.phone && post_body.email && post_body.password) {
        var reg_user = { "name": post_body.name, "id": post_body.id, "phone": post_body.phone, "email": post_body.email, "password": post_body.password };
        try {
            if (storage_manager.registerUser(reg_user)) {
                req.session.user = post_body.name;
                req.session.cookie.maxAge = 60 * 60 * 24 * 7 * 1000;
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(JSON.stringify(reg_user));
            } else {
                res.writeHead(409, { 'Content-Type': 'text/plain' });
                res.end("Register fail.");
            }
        } catch (e) {
            res.writeHead(409, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify(e));
        }
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end("Bad request.");
    }
});

module.exports = router;

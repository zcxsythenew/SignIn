'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var storage_manager = require('../storage/storage');

/* GET home page. */
router.get('/', function (req, res) {
    if (req.session.user) {
        var query_user = storage_manager.queryUser(req.session.user);
        if (query_user) {
            fs.readFile("views/i.html", (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end("Home page not found");
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    var str = data.toString();
                    str = str.replace("{name}", query_user.name);
                    str = str.replace("{name}", query_user.name);
                    str = str.replace("{id}", query_user.id);
                    str = str.replace("{phone}", query_user.phone);
                    str = str.replace("{email}", query_user.email);
                    if (!url.parse(req.url).query || !querystring.parse(url.parse(req.url).query).username
                        || querystring.parse(url.parse(req.url).query).username === query_user.name) {
                        str = str.replace("{status_preserved}", "");
                    } else {
                        str = str.replace("{status_preserved}", "只能够访问自己的数据");
                    }
                    res.write(str);
                    res.end();
                }
            });
        } else {
            fs.readFile("views/index.html", (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end("Home page not found");
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(data.toString());
                    res.end();
                }
            });
        }
    } else {
        fs.readFile("views/index.html", (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Home page not found");
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data.toString());
                res.end();
            }
        });
    }
});

module.exports = router;

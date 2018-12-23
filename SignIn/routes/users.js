'use strict';
var express = require('express');
var router = express.Router();
var fs = require('fs');
var storage_manager = require('../storage/storage');
var querystring = require('querystring');
var bcrypt = require('bcrypt');
var url = require('url');

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

router.post('/', function (req, res) {
    var post_body = querystring.parse(req.body);
    if (post_body.name) {
        var query_user = storage_manager.queryUser(post_body.name);
        if (query_user && bcrypt.compareSync(post_body.password, query_user.password)) {
            req.session.user = post_body.name;
            req.session.cookie.maxAge = 60 * 60 * 24 * 7 * 1000;
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify(query_user));
        } else {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end("错误的用户名或密码");
        }
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end("Bad request.");
    }
});

module.exports = router;

'use strict';
var fs = require('fs');
var bcrypt = require('bcrypt');
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var MongoUrl = "mongodb://localhost:27017/runoob";

var storage_manager = {
    "storage": {
        "readFromFile": function () {
            MongoClient.connect(MongoUrl, { useNewUrlParser: true }, (err, result) => {
                if (!err) {
                    var dbase = result.db("runoob");
                    var col = dbase.collection("users");
                    if (!col) {
                        dbase.createCollection("users", (error, res) => {
                            this.users = [];
                            result.close();
                        });
                    } else {
                        col.find({}).toArray((e, r) => {
                            if (!e) {
                                this.users = r;
                            } else {
                                this.users = [];
                            }
                            result.close();
                        });
                    }
                }
            });
        },

        /* "writeToFile": function () {
            if (!fs.existsSync("data")) {
                fs.mkdirSync("data");
            }
            fs.writeFile("data/users.json", JSON.stringify(this.users), (err) => {
                if (err) {
                    console.log(err.message);
                }
            });
            
        }, */

        "createUser": function (user) {
            if (!this.users) this.users = [];
            user.password = bcrypt.hashSync(user.password, 10);
            this.users.push(user);
            MongoClient.connect(MongoUrl, { useNewUrlParser: true }, (err, result) => {
                if (!err) {
                    var dbase = result.db("runoob");
                    var col = dbase.collection("users");
                    col.insert(user, (error, res) => {
                        result.close();
                    });
                }
            });

        },

        "queryUser": function (filter) {
            return this.users.filter((value, index, users) => {
                return filter(value);
            });
        },

        "users": null
    },
    "registerUser": function registerUser(user) {
        if (user.name && user.id && user.phone && user.email && user.password) {
            var status = true;
            var err = {
                name: false,
                id: false,
                phone: false,
                email: false,
                password: false
            };
            if (!user.name.match(/[A-Za-z][A-Za-z0-9_]{5,17}/) || this.storage.queryUser((usr) => {
                return usr.name === user.name;
            }).length !== 0) {
                err.name = true;
                status = false;
            }
            if (!user.id.match(/[1-9][0-9]{7}/) || this.storage.queryUser((usr) => {
                return usr.id === user.id;
            }).length !== 0) {
                err.id = true;
                status = false;
            }
            if (!user.phone.match(/[1-9][0-9]{10}/) || this.storage.queryUser((usr) => {
                return usr.phone === user.phone;
            }).length !== 0) {
                err.phone = true;
                status = false;
            }
            if (!user.email.match(/^[a-zA-Z_\-]+@(([a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/) || this.storage.queryUser((usr) => {
                return usr.email === user.email;
            }).length !== 0) {
                err.email = true;
                status = false;
            }
            if (!user.password.match(/[A-za-z0-9\-_]{6,12}/)) {
                err.password = true;
                status = false;
            }
            if (status) {
                this.storage.createUser(user);
                return true;
            } else {
                throw err;
            }
        } else {
            throw "请完整填写用户名、学号、电话和邮箱后注册";
        }
    },
    "queryUser": function queryUser(nameStr) {
        if (nameStr) {
            var arr;
            arr = this.storage.queryUser((usr) => {
                return usr.name === nameStr;
            });
            if (arr.length !== 0) {
                return arr[0];
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    "deleteUser": function deleteUser(idStr) {
        if (idStr) {
            if (this.storage.deleteUser((usr) => {
                return usr.id === idStr;
            })) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};

storage_manager.storage.readFromFile();
module.exports = storage_manager;
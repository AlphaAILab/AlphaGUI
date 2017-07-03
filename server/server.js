var User = require('./user.js').User;
var load = require("./user.js").load;
var get_name = require("./user.js").get_name;
var get_uuid = require("./user.js").get_uuid;



var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(23333);

load();

name2user = {};

io.on("connection", function(socket) {
    var user = null;

    socket.on("sign_up", function (uuid, username_) {
        if (get_uuid(username_) === undefined) {
            user = new User(uuid);
            user.name = username_;
            user.socket = socket;
            user.save();
            
            name2user[user.name] = user;
            socket.emit("signup_success", username_);
            return;
        } else {
            socket.emit("name_be_used", username_);
        }
    });

    socket.on("update_status", function (uuid, status, opponent) {
        if (user === null) {
            if (get_name(uuid) === undefined) {
                socket.emit("unregistered");
                return;
            }
            user = new User(uuid);
        }
        user.socket = socket;
        user.status = status;
        user.opponent = opponent;
        name2user[user.name] = user;

        console.log(name2user);
    });

    socket.on("forward", function(toname, cmd, args) {
        if (user === null) {
            socket.emit("not_logged");
            return;
        }

        var touser = name2user[toname];
        if (touser === undefined || touser.socket === null) {
            socket.emit("forward_failed", toname);
        } else {
            touser.socket.emit("forward", cmd, args);
        }
    });

    socket.on("match", function(op) {
        if (user === null) {
            socket.emit("not_logged");
            return;
        }

        var touser = name2user[op];
        if (touser === undefined || touser.socket === null || 
        touser.opponent !== null || user.opponent !== null) {
            socket.emit("match_failed");
        } else {
            user.opponent = op;
            touser.opponent = user.name;
            user.emit("matched", op);
            touser.emit("matched", user.name);
        }
    });

    socket.on("disconnect", function() {
        if (user === null) {
            return;
        }

        user.socket = null;
        setTimeout(function() {
            var new_user = name2user[user.name];
            if (new_user === undefined || new_user.socket == null) {
                new_user.status = "offline";
                
                if (user.opponent) {
                    var touser = name2user[user.opponent];
                    if (touser !== undefined && touser.socket !== null) {
                        touser.emit("opponet_disconnected", user.name);
                    }
                    user.opponent = null;
                }
            }

            console.log(name2user);
        }, 10000);
    });

    socket.on("get_online_users", function() {
        var r = []
        for (var key in name2user) {
            if (name2user[key].status === "online" || name2user[key].status === "fighting") {
                r.push({name: key, status: name2user[key].status});
            }
        }
        socket.emit("online_users", r);
    });
});

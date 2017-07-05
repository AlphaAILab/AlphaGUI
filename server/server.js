var User = require('./user.js').User;
var load = require("./user.js").load; var get_name = require("./user.js").get_name;
var get_uuid = require("./user.js").get_uuid;



var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(23333);

load();

name2user = {};
kv = {};

function gen_uuid(){
    var ch = [];
    for(var x = 0 ; x<9;x++) ch.push(x);
    var tmp = "abcdefghijklmnopqrstuvwxyz";
    for(var x = 0 ; x<tmp.length; x++){
        ch.push(tmp[x]);
    }
    tmp = tmp.toUpperCase();
    for(var x = 0; x<tmp.length;x++){
        ch.push(tmp[x]);
    }
    var uuid = '';
    for(var x = 0;x<8;x++){
        uuid += ch[parseInt(Math.random()*ch.length)];
    }
    return uuid;
}

function get_online_users() {
    var r = [];
    for (var key in name2user) {
        if (name2user[key].status === "online" || name2user[key].status === "fighting") {
            r.push({name: key, status: name2user[key].status});
        }
    }
    return r;
}

function broadcast_online_users(socket) {
    var r = get_online_users();
    socket.emit("online_users", r);
    socket.broadcast.emit("online_users", r);
}

io.on("connection", function(socket) {
    var user = null;

    socket.on("sign_up", function (uuid, username_) {
        if (typeof (username_) == "string" && get_uuid(username_) === undefined) {
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

        console.log(user.name + " to " + toname + ": " + cmd + "\t" + args);
        var touser = name2user[toname];
        if (touser === undefined || touser.socket === null) {
            console.log("forward_failed");
            socket.emit("forward_failed", toname);
        } else {
            console.log("forward");
            if (cmd === "set_config") {
                if (tyeof(args.game_id) === "string" && args.game_id.length > 4) {
                    kv[args.game_id][user.name] = args.config;
                }
            }

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
            var game_id = gen_uuid();
            user.opponent = op;
            user.status = "fighting";
            touser.opponent = user.name;
            tosockettatus = "fighting";
            touser.socket.emit("matched", user.name, game_id);
            socket.emit("matched", op);
        }
    });

    socket.on("start", function(toname, gmae_id) {
        var touser = name2user[toname];
        if (toname && toname.socket) {
            touser.socket.emit("start", game_id, op_name, kv[game_id]);
            socket.emit("start", game_id, op_name, kv[game_id]);
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
                        touser.socket.emit("opponet_disconnected", user.name);
                    }
                    user.opponent = null;
                }
            }
            console.log(name2user);
        }, 10000);
    });

    socket.on("get_online_users", function() {
        var r = get_online_users();
        socket.emit("online_users", r);
        console.log(r);
    });
});

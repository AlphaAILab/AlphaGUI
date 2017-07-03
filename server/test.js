var io = require("socket.io-client");


users = [
    {
        uuid: "asdfasfaef",
        name: "zrt"
    },
    {
        uuid: "flskdfaoiehfnkjeanf",
        name: "Chenyao2333"
    }
]

for (var x of users) {
    var s = io("http://localhost:23333");
    s.emit("sign_up",  x.uuid, x.name);
    s.emit("update_status", x.uuid, "online", null);

    if (x.name == "Chenyao2333") {
        s.emit("forward", "zrt", "to233", "froms")
        s.on("forward_failed", function() {
            console.log("forward failed!")
        });
    }
    s.on("signup_success", function(name) {
        console.log(name + ": sigup success!");
    });

    s.on("name_be_used", function (name) {
        console.log(name + ": name be used");
    });

    s.on("forward", function (cmd, args) {
        console.log("cmd: " + cmd + "\nargs: " + args);
    })
}

var s = io("http://localhost:23333");
s.emit("get_online_users");


s.on("online_users", function (users) {
    console.log(users);
})
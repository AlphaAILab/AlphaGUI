'use strict';

var ipcRenderer = require("electron").ipcRenderer;
var uuid;
var username;

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
    for(var x = 0;x<16;x++){
        uuid += ch[parseInt(Math.random()*ch.length)];
    }
    return uuid;
}


var box;
function start(){



    uuid = localStorage.getItem('uuid');
    if(!uuid ||uuid.length!=16){
        uuid = gen_uuid();
        localStorage.setItem('uuid',uuid);
    }
    username =  localStorage.getItem('username');
    if(!username || !/^[0-9a-zA-Z_]{3,12}$/.test(username)){
        box =$.confirm({
            title: 'Sign Up',
            content: '<fieldset><div id="warn"> </div> <input type="text" id="inputname" placeholder="Your nickname" class="name form-control" pattern="^[0-9a-zA-Z_]{3,12}$" required /> <br/> <button class = "btn" onclick="signup();" id = "btn-ok">OK</button></fieldset>',
            buttons:{
                ok:{
                    btnClass : 'nosee',
                    action: function(){
                        start();
                    }
                }
            },
            onOpenBefore: function () {
                $('.nosee').hide();
            },
        });
    } else {
        ipcRenderer.send("sign_up", localStorage.getItem("uuid"), username);
        ipcRenderer.send("update_status", "online", null );
    }



}

function signup() {
    var username_ = $("#inputname").val();
    if (/^[0-9a-zA-Z_]{3,12}$/.test(username_)) {
        ipcRenderer.send("sign_up", uuid, username_);
        $("#warn").html(`<p class="text-info">Connecting...</p>`);
        $("#btn-ok").hide();
        
        ipcRenderer.on("signup_success", function(e, username_) {
            username = username_;
            localStorage.setItem("username", username);
            $.alert({
                title: "",
                content: "Success!"
            });
            ipcRenderer.send("sign_up", localStorage.getItem("uuid"), username);
            ipcRenderer.send("update_status", "online", null );
            box.close();
        });
        ipcRenderer.on("name_be_used", function(e, username_) {
            $("#warn").html(`<p class="text-danger">Name has been used!</p>`);
            $("#btn-ok").show();
        });
    } else {
        $("#warn").html(`<p class="text-danger">Only allow ^[0-9a-zA-Z_]{3,12}$!</p>`);
    }
}

$(start);
'use strict'

var polling_time = 2000;
var {ipcRenderer} = require("electron");

var online_list = [];


function receive_invite(from){
    var options =  {
        content: `<div id="bar${from}"><p style="font-size:1.5em">${from} want to play with you!</p> <button class="btn btn-success" onclick="click_agree('${from}')">Accept</button> <button class="btn btn-danger" onclick="click_refuse('${from}')">Refuse</button></div>`, 
        htmlAllowed: true,
        timeout: 12000
    }
    var bar = $.snackbar(options);
    $(document).off("click","#snackbar-container .snackbar")
}

function register_invite() {
    ipcRenderer.once("invite", function(e, from) {
        // call zrt's func, received invitation
        console.log("received invitation " + from);
        receive_invite(from);
        register_invite();
    });
    ipcRenderer.send("register", "invite");
}

function register_refuse() {
    ipcRenderer.once("refuse", function(e, from) {
        console.log("refuse " + from);
        $.snackbar({
            content: `${from} refused your invitation.`,
            timeout:8000
        })
        register_refuse();
    });
    ipcRenderer.send("register", "refuse");
}

function click_refuse(toname) {
    $(`#bar${toname}`).parent().parent().hide();
    $(`#bar${toname}`).removeAttr('id');

    ipcRenderer.send("forward", toname, "refuse", username);
}

function click_agree(toname) {
    $(`#bar${toname}`).parent().parent().hide();
    $(`#bar${toname}`).removeAttr('id');
    
    ipcRenderer.send("match", toname);
}

function get_online(callback){
    ipcRenderer.once("online_users", function (e, users) {
        online_list = users;
        callback(online_list);
    });
    ipcRenderer.send("get_online_users");
}

function click_online(name){
    var username = localStorage.getItem('username');
    if(name === username ){
        $.alert('Try to click other player!');
        return;
    }else{
        $.confirm({
            title: 'Play with '+name+'!',
            content : 'Click OK to play with '+name+'.',
            buttons:{
                OK: {
                    btnClass:"btn btn-success btn-raised",
                    action:function(){
                        // 发邀请
                        ipcRenderer.send("invite", name);
                        $.snackbar({
                            content: "Invitation has been sent, waiting for "+name+" to accept.",
                            style: "toast",
                            timeout: 8000
                        })
                        console.log('click ok '+name);
                    }
                },
                cancel : function(){
                    console.log('cancel it');
                }
            }
        })
    }
}

function click_playing(name){
    var username = localStorage.getItem('username');
    if(name === username ){
        $.alert('Try to click other player!');
        return;
    }else{
        $.confirm({
            title: 'Watch '+name+'\'s game!',
            content : 'Click OK to watch '+name+'\'s game.',
            buttons:{
                OK: function(){
                    $.alert('Not support yet.');
                    console.log('click ok '+name);
                },
                cancel : function(){
                    console.log('cancel it');
                }
            }
        })
    }
}

function list2html(list){
    var s = '';
    for(var x of list){
        if(x.status === 'online'){
            s+=`<a href="javascript:click_online('${x.name}')"><span class="online-name">`+x.name+"  </span>"+'<span class="online-status label label-success">'+" ONLINE "+"</span><br/>"+'</a>'
        
        }else{
            s+=`<a href="javascript:click_playing('${x.name}')"><span class="online-name">`+x.name+"  </span>"+'<span class="online-status label label-info">'+" PLAYING "+"</span><br/>"+'</a>'
        
        }
    }
    return s;
}

function render_online(callback){
    get_online(function (list) {
        $('#online-list').html(list2html(list));
        var ok = false;
        for(var x of list){
            var username = localStorage.getItem('username');
            if(x.name && x.name === username){
                ok = true;
                break;
            }
        }

        if (ok === false || list.length === 0) {
            $('.online-num').text("Loading...");
        } else {
            $('.online-num').text("ONLINE: " + list.length);
        }

        if (callback) callback();
    });
}

function click_return(){
    var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
        showLeft = document.getElementById( 'showLeft' ),
        body = document.body;
        classie.toggle( menuLeft, 'cbp-spmenu-open' );
}

function online_start(){
    
    register_invite();
    register_refuse();
    /*function try_get_online() {
        render_online(function () {
            if (online_list.length === 0) {
                setTimeout(try_get_online, 1500);
            }
        });
    }
    try_get_online();*/
    render_online();
    setInterval(render_online, polling_time);

    var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
        showLeft = document.getElementById( 'showLeft' ),
        body = document.body;

    showLeft.onclick = function() {
        // classie.toggle( this, 'active' );
        classie.toggle( menuLeft, 'cbp-spmenu-open' );
    };
    
}

$(online_start)

'use strict'

var {ipcRenderer} = require("electron");

var online_list = [];

function get_online(callback){
    ipcRenderer.on("online_users", function (e, users) {
        online_list = users;
        callback(online_list);
    });
    ipcRenderer.send("get_online_users");
}

function click_online(name){
    $.alert('click online'+name);
}
function click_playing(name){
    $.alert('click playing'+name);

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
        if (list.length === 0) {
            $('.online-num').text("loading...");
        } else {
            $('.online-num').text("Online: " + list.length);
        }
        callback();
    });
}

function click_return(){
    var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
        showLeft = document.getElementById( 'showLeft' ),
        body = document.body;
        classie.toggle( menuLeft, 'cbp-spmenu-open' );
}

function start(){
    function try_get_online() {
        render_online(function () {
            if (online_list.length === 0) {
                setTimeout(try_get_online, 500);
            }
        });
    }
    try_get_online();
    setInterval(render_online, 10000);

    var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
        showLeft = document.getElementById( 'showLeft' ),
        body = document.body;

    showLeft.onclick = function() {
        // classie.toggle( this, 'active' );
        classie.toggle( menuLeft, 'cbp-spmenu-open' );
    };
    
}

$(start)

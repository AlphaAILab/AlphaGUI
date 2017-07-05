'use strict'

var online_list = [];

function get_online(){
    // todo

    //test code
    online_list = [];
    for(var x =0 ; x<=13 ; x++){
        online_list.push({
            name: 'Friend'+x,
            status : 'online'
        })
    }
    // for(var x =0 ; x<=13 ; x++){
    //     online_list.push({
    //         name: 'Hahaha'+x,
    //         status : 'offline'
    //     })
    // }
    for(var x =0 ; x<=13 ; x++){
        online_list.push({
            name: 'mmmmmmmmmmmm'+x,
            status : 'Playing'
        })
    }
    return online_list;
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

function render_online(){
    var list = get_online();
    $('#online-list').html(list2html(list));
    $('.online-num').text(list.length);
}

function click_return(){
    var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
        showLeft = document.getElementById( 'showLeft' ),
        body = document.body;
        classie.toggle( menuLeft, 'cbp-spmenu-open' );
}

function start(){
    get_online();
    render_online();
    var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
        showLeft = document.getElementById( 'showLeft' ),
        body = document.body;

    showLeft.onclick = function() {
        // classie.toggle( this, 'active' );
        classie.toggle( menuLeft, 'cbp-spmenu-open' );
    };
    
}

$(start)

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
            name: 'Bong'+x,
            status : 'Playing with xxx'
        })
    }
}
function render_online(){
    //
    // $('#online').html(sss)
}

function start(){
    get_online();
    render_online();
    
}

$(start)

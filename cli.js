'use strict'

var Once = require('./once.js');

var win = [0,0]
var bot_path1 
var bot_path2 

var r_n =100
var r = 0
var detail = false
var full = false
var roundtime = 2
function arrcopy(ret,a){ // ret must be []
    for(var x of a){
        ret.push(x);
    }
}


function callback(winner,_detail,_full,_r){
    if(_r!=r){
        return;
    }else{
        r++;
    }
    if(r>=r_n) return;
    // console.log(detail)
    // console.log(full)
    console.log(winner,win)
    win[winner]++
    // console.log(win)
    // console.log(score)

    var log = ''
    if(full){
        log+=_full
        log+='\n'
    }
    if(detail){
        for(var x of _detail){
            log += `[${x}],`
        }
        log+='\n'
    }
    log+= win+'\n'
    // console.log(log)
    $('#log').after('<pre>'+log+'</pre>');
     run();
    // setTimeout(function() {
    //     run();
    // }, 100);
    // var s = $('#log').val()
}
function run(){
    var O = new Once(bot_path1,bot_path2,roundtime,detail,full,r)
    O.run(callback)    

}

function click_stop(){
    if($('#btnstop').hasClass('disabled')) return;
    r_n = 0;
    $('#btnrun').removeClass('disabled');
    $('#btnstop').addClass('disabled');

}
function click_clear(){
    $('#flog').html('<div  id="log"></div>')

}

function click_run(){
    if($('#btnrun').hasClass('disabled')) return;
    r = 0
    win = [0,0]
    $('#btnrun').addClass('disabled');
    $('#btnstop').removeClass('disabled');
    bot_path1 = '';
    try{
        bot_path1 = $('#inputPath1').get(0).files[0].path;
    }catch(e){
        var options =  {
            content: "Path1 error!", 
            style: "toast", 
            timeout: 3000 
        }
        $.snackbar(options);
        return;
    }
    bot_path2 = '';
    try{
        bot_path2 = $('#inputPath2').get(0).files[0].path;
    }catch(e){
        var options =  {
            content: "Path2 error!", 
            style: "toast", 
            timeout: 3000 
        }
        $.snackbar(options);
        return;
    }
    if(!bot_path1 || !bot_path2){
        var options =  {
            content: "Please input AI path.", 
            style: "toast", 
            timeout: 3000 
        }
        $.snackbar(options);
        return;
    }
    detail = $('#detail').is(":checked")
    full = $('#fulllog').is(":checked")
    roundtime = parseInt($('#roundtime').val())
    if(roundtime>=0 && roundtime <=100){
        
    }else{
        roundtime = 2
    }
    $('#roundtime').val(roundtime)
    var roundnum = parseInt($('#roundnumber').val())
    if(roundnum>=1 && roundnum <=10000){
        
    } else{
        roundnum = 100
    } 
    $('#roundnumber').val(roundnum)
    console.log(roundnum)
    r_n = roundnum +1

    run(detail,fulllog,roundtime)

}

'use strict'

var ipc = require("electron").ipcRenderer;
var myid = localStorage.getItem('username');
var A_is_ai ;
var A_ai_id ;
var A_is_human ;
var B_is_ai;
var B_is_remote;
var B_ai_id;
var Atype='',Btype='';
var Abot;
var Bbot;
var Aroundtime = 100;
var Broundtime = 20;
var hideB = true;
var AI_wait_time =200;// ms
var opid = 'bug';
var if_hide_b = true;
var is_ready = false;
var op_is_ready = false;
var start_timer = null;

function getUrlVar(key){
	var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search); 
	return result && unescape(result[1]) || ""; 
}

function testurl(key){
    var ret = getUrlVar(key);
    if(ret === "") return false;
    else return true;
}


// debug
// if(!getUrlVar('myID')){
//     window.location.search = 'myID=mmmmmmmmmmmm&A_is_ai=aaa&A_ai_id=0&B_is_ai=aaa&B_ai_id=0';
// }
// //



function click_human(){
    A_is_ai = false;
    A_is_human = true;
    Atype = 'human'

    $('#Acur').text('HUMAN');

    show_settings();
    save_settings();

    render_play();

}

function click_A_ai(){
    // choose ai
    A_is_ai = true;
    A_is_human = false;

    var param = {
        url:'aaa',
        myid:myid,
        select : 'A'    
    }
    param.Btype = 'unknow';
    if(B_is_ai){
        param.Btype = 'ai';
        param.B_is_ai = 'aaa';
        param.B_ai_id = B_ai_id;
    }
    if(B_is_remote){
        param.Btype = 'remote';
        param.B_is_remote = 'aaa';
        param.Bname = opid;

    }

    location.href = './myai.html?'+$.param(param);

}

function click_B_ai(){
    B_is_ai = true;
    B_is_remote = false;
    // choose ai
    var param = {
        url:'aaa',
        myID:myid,
        select : 'B'    
    }
    param.Atype = 'unknow';
    if(A_is_ai){
        param.Atype = 'ai';
        param.A_is_ai = 'aaa';
        param.A_ai_id = A_ai_id;
        
    }
    if(A_is_human){
        param.Atype = 'human';
        param.A_is_human = 'aaa';

    }

    location.href = './myai.html?'+$.param(param);

}
function get_my_param(){
    var ret = {};
    if(A_is_human){
        ret.type = 'human';
    }else if(A_is_ai){
        ret.type = 'ai';
        ret.botid = Abot.botid;
    }
    ret.roundtime = Aroundtime;
    ret.hide = hideB;
    ret.aiwaittime = AI_wait_time;
    ret.is_ready = is_ready;
    return ret;
}

function process_start() {
    if (is_ready && op_is_ready) {
        start_timer = setTimeout(function() {
            console.log('send start');
            if (myid < opid && is_ready  && op_is_ready) {
                ipc.send("start", opid);
            }
        }, 2000);
    } else {
        if (start_timer) clearTimeout(start_timer);
    }
}

function send_config() {
    let config = get_my_param();
    ipc.send("forward", opid, "set_config", config);

    process_start();
}

function reigster_set_config() {
    ipc.once("set_config", function (e, op_config) {
        $("#optype").text(op_config.type);
        $("#ophideB").text(op_config.hide);
        $("#oproundtime").text(op_config.roundtime);
        $("#opaiwaittime").text(op_config.aiwaittime/1000);
        $("#opisready").text(op_config.is_ready);
        
        op_is_ready = op_config.is_ready;

        process_start();
        reigster_set_config();
    });
    ipc.send("register", "set_config");
}
function show_settings(){
    if(Atype === 'human'){
        var _hide = localStorage.getItem('human_hide');
        if(_hide === 'false'){
            hideB=false;
        }else{
            hideB=true;
        }
        $('#hidehands').attr('checked',hideB);
        $('#roundtime').val(localStorage.getItem('human_roundtime'));
        $('#aiwaittime').val(localStorage.getItem('aiwaittime'));
    }else{
        var _hide = localStorage.getItem('ai_hide');
        if(_hide === 'false'){
            hideB=false;
        }else{
            hideB=true;
        }
        $('#hidehands').attr('checked',hideB);
        $('#roundtime').val(localStorage.getItem('ai_roundtime'));
        $('#aiwaittime').val(localStorage.getItem('aiwaittime'));
    }
    var order = localStorage.getItem('orderby');
    var orderby = false;
    if(order === 'number') orderby =true;
    $('#orderby').attr('checked',orderby);
    save_settings();
}
function save_settings(dont_call){
    hideB = $('#hidehands').is(":checked");
    var x =  $('#roundtime').val();
    try{x = parseInt(x);}catch(e){}
    if(typeof(x) === 'number' && x>=1 && x<=200){
        Aroundtime = Broundtime = x;
    }else{
        x=2;
    }
    $('#roundtime').val(x);

    var y = $('#aiwaittime').val();
    try{y = parseFloat(y);}catch(e){};
    if(typeof(y) === 'number' && y>=0 && y<=20){
        AI_wait_time = y*1000;
    }else{
        y=0.1;
    }
    $('#aiwaittime').val(y);

    // console.log(get_my_param());
    
    if (!dont_call) {
        render_play();
    }
    if($('#orderby').is(":checked")){
        localStorage.setItem('orderby','number');
    }else{
        localStorage.setItem('orderby','color');

    }
    if(Atype === 'human'){
        localStorage.setItem('human_hide',hideB);
        localStorage.setItem('human_roundtime',x);
        localStorage.setItem('aiwaittime',y);
    }else{
        localStorage.setItem('ai_hide',hideB);
        localStorage.setItem('ai_roundtime',x);
        localStorage.setItem('aiwaittime',y);
    }

    if (Btype == "remote") {
        send_config();
    }
}

function click_remote(){
    // B_is_remote = true;
    // B_is_ai = false;
    // // choose online 0.0
    // B_is_remote = true;
    // Btype = 'remote';
    // opid = 'Chenyao2333';
    // var Bcur = opid;
    // $('#Bcur').text(Bcur);
    // $('#Bid').text(opid);


    // render_play();

    click_return();

}

function click_remote_play() {
    if (is_ready) {
        is_ready = false;
        $("#play").text("ready");
        $("#btn-save").show();
    } else {
        is_ready = true;
        $("#play").text("cancel");
        $("#btn-save").hide();
    }

    send_config();
}


function click_local_play(x){
    save_settings();
    if(x === 'human_ai'){
        location.href = './arena.html?'+$.param({
            url : 'aaaa',
            game_type : 'human_ai',
            Bname : 'AI:'+Bbot.name,
            Agid : 0,
            Bgid : 1,
            Aroundtime : Aroundtime,
            Broundtime : Broundtime,
            AIwaittime : AI_wait_time,
            hideB : hideB,
            Bbotid : Bbot.botid
        })
    }else if(x==='ai_ai'){
        location.href = './arena.html?'+$.param({
            url : 'aaaa',
            game_type : 'ai_ai',
            Aname : 'AI:'+Abot.name,
            Bname : 'AI:'+Bbot.name,
            Agid : 0,
            Bgid : 1,
            Aroundtime : Aroundtime,
            Broundtime : Broundtime,
            AIwaittime : AI_wait_time,
            hideB : hideB,
            Abotid : Abot.botid,
            Bbotid : Bbot.botid
        })
    }else{
        console.log(x);
    }
}

function render_play(){
    save_settings("sb");
    $('#play').removeAttr('href');
    if (Btype == "remote") {
        if (is_ready)  $("#play").text("cancel");
        else $("#play").text("ready");
    }
    if(Atype === 'human' && Btype === 'ai'){
        $('#play').attr('href','javascript:click_local_play("human_ai");')
    }else if(Atype === 'ai' && Btype === 'ai'){
        $('#play').attr('href','javascript:click_local_play("ai_ai");')
    }else if(Atype === 'ai' && Btype === 'remote'){
        $('#play').attr('href','javascript:click_remote_play()');
    }else if(Atype === 'human' && Btype === 'remote'){
        $('#play').attr('href','javascript:click_remote_play()');
    }else {
        if (!Atype) {
            $("#play").attr("href", "javascript: $.alert('Please select your AI.')");
        } else {
            $("#play").attr("href", "javascript: $.alert('Please select your oponenent.')");
        }
    }

}

function start(){
    A_is_ai = testurl('A_is_ai');
    A_ai_id = -1;
    if(A_is_ai){
        A_is_ai = true;
        A_ai_id = parseInt(getUrlVar('A_ai_id'));
    }
    A_is_human = testurl('A_is_human');
    B_is_ai = testurl('B_is_ai');
    B_is_remote = testurl('B_is_remote');
    B_ai_id = getUrlVar('B_ai_id');
    
    if(A_is_ai && A_is_human) alert('both human & ai');
    if(B_is_ai && B_is_remote) alert('both ai & remote');

    var Acur = 'NOT CHOOSE';
    if(A_is_ai){
        Atype = 'ai';
        var botlist = JSON.parse(localStorage.getItem('botlist'));
        Abot = botlist[A_ai_id];
        Acur = 'AI '+Abot.name;

        Aroundtime = 2;
        $('#roundtime').val(2);


    }
    if(A_is_human){
        Atype = 'human';
        Acur = 'HUMAN'

        Aroundtime = 100;
        $('#roundtime').val(100);
    }
    var Bcur = 'not choose';
    if(B_is_ai){
        Btype = 'ai';
        var botlist = JSON.parse(localStorage.getItem('botlist'));
        Bbot = botlist[B_ai_id];
        Bcur = 'AI '+Bbot.name;
    }
    if(B_is_remote){
        Btype = 'remote';
        opid = getUrlVar('Bname');
        // do something remote
        Bcur = opid;
        $('#notonlineop').hide();
        $('#onlineop').show();
        
        $('#optype').text('not choose');
        $('#oproundtime').text('not choose');
        $('#ophideB').text('not choose');
        $('#opaiwaittime').text('not choose');

        // get 对方信息 更新显示以及本地变量
        ipc.on("opponet_disconnected", function (e) {
            $.confirm({
                content: opid + " exit the game!",
                buttons: {
                    ok: function() {
                        location.href = "./home.html"
                    }
                }
            })
        });
        reigster_set_config();

        setInterval(function() {
            if (is_ready) {
                save_settings();
            }
        }, 1000);
        setInterval(function() {
            if (!is_ready) {
                save_settings();
            }
        }, 3000);
    }

    show_settings();
    // if(A_is_ai && B_is_ai){
    //     hideB = false;
    //     $('#hidehands').attr('checked',false);
    // }




    save_settings();
    $('#Aid').text(myid);
    $('#Bid').text('Opponent');
    if(B_is_remote){
        $('#Bid').text(opid);
    }
    $('#Acur').text(Acur);
    $('#Bcur').text(Bcur);

    render_play();

    if(testurl('ready')){
        $('#play').click();
    }
}


$(start);
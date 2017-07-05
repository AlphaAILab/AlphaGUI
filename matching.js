'use strict'

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
var opid = 'zrt';
var if_hide_b = true;

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
    
    Aroundtime = 100;
    $('#roundtime').val(100);

    $('#Acur').text('human');

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
    }
    ret.roundtime = Aroundtime;
    ret.hide = hideB;
    ret.aiwaittime = AI_wait_time;
    return ret;
}

function save_settings(){
    if($('#hidehands').attr('checked') === 'checked'){
        hideB =true;
    }else{
        hideB = false;
    }
    var x =  $('#roundtime').val();
    try{x = parseInt(x);}catch(e){}
    if(typeof(x) === 'number' && x>=1 && x<=200){
        Aroundtime = Broundtime = x;
    }else{
        x=2;
    }
    $('#roundtime').val(x);

    var y = $('#aiwaittime').val();
    if(typeof(y) === 'number' && y>=0 && y<=5){
        AI_wait_time = y*1000;
    }else{
        y=0.1;
    }
    try{y = parseFloat(y);}catch(e){};
    $('#aiwaittime').val(y);

    console.log(get_my_param());
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



function render_play(){
    $('#play').removeAttr('href');
    if(Atype === 'human' && Btype === 'ai'){
        $('#play').attr('href','./arena.html?'+$.param({
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
        }))
    }else if(Atype === 'ai' && Btype === 'ai'){
        $('#play').attr('href','./arena.html?'+$.param({
            url : 'aaaa',
            game_type : 'ai_ai',
            Aname : 'AI:'+Abot.name,
            Bname : 'AI:'+Bbot.name,
            Agid : 0,
            Bgid : 1,
            Aroundtime : Aroundtime,
            Broundtime : Broundtime,
            AIwaittime : AI_wait_time,
            hideB : false,
            Abotid : Abot.botid,
            Bbotid : Bbot.botid
        }))
    }else if(Atype === 'ai' && Btype === 'remote'){
        $('#play').attr('href','./arena.html?'+$.param({
            url : 'aaaa',
            game_type : 'online',
            Aname : myid,
            Bname : opid,
            Aroundtime : Aroundtime,
            Broundtime : Broundtime,
            AIwaittime : AI_wait_time,
            hideB : if_hide_b,
            Abotid : Abot.botid,
            A_is_ai:'aaa'
        }))
    }else if(Atype === 'human' && Btype === 'remote'){
        $('#play').attr('href','./arena.html?'+$.param({
            url : 'aaaa',
            game_type : 'online',
            Aname : myid,
            Bname : opid,
            Aroundtime : Aroundtime,
            Broundtime : Broundtime,
            AIwaittime : AI_wait_time,
            hideB : if_hide_b,
            A_is_human:'aaa'
        }))
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

    var Acur = 'not choose';
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
        Acur = 'human'

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

    }
    if(A_is_ai && B_is_ai){
        hideB = false;
        $('#hidehands').attr('checked',false);
    }



    save_settings();
    $('#Aid').text(myid);
    $('#Bid').text('Opponent');
    if(B_is_remote){
        $('#Bid').text(opid);
    }
    $('#Acur').text(Acur);
    $('#Bcur').text(Bcur);

    render_play();

}


$(start);
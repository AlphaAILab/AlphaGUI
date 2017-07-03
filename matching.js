'use strict'

var myid = "Ruotian";
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
//     window.location.search = 'myID=testID&A_is_ai=aaa&A_ai_id=0&B_is_ai=aaa&B_ai_id=0';
// }
// //


function click_human(){
    A_is_ai = false;
    A_is_human = true;
    Atype = 'human'

    $('#Acur').text('human');

    render_play();

}

function click_A_ai(){
    // choose ai

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
        // save remote status 
        // 或者下次直接获取

    }

    location.href = './myai.html?'+$.param(param);

}

function click_B_ai(){
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
        // save remote status 
        // 或者下次直接获取

    }

    location.href = './myai.html?'+$.param(param);

}

function click_remote(){
    // choose online 0.0

}



function render_play(){
    $('#play').removeAttr('href');
    if(Atype === 'human' && Btype === 'ai'){
        $('#play').attr('href','./arena.html?'+$.param({
            url : 'aaaa',
            game_type : 'human_ai',
            Aname : myid,
            Bname : 'My AI: '+Bbot.name,
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
            myid :myid,
            game_type : 'ai_ai',
            Aname : 'My AI: '+Abot.name,
            Bname : 'My AI: '+Bbot.name,
            Agid : 0,
            Bgid : 1,
            Aroundtime : Aroundtime,
            Broundtime : Broundtime,
            AIwaittime : AI_wait_time,
            hideB : false,
            Abotid : Abot.botid,
            Bbotid : Bbot.botid
        }))
    }

}

function start(){
    myid = getUrlVar('myid') || "Ruotian";
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

    }
    if(A_is_human){
        Atype = 'human';
        Acur = 'human'
    }
    var Bcur = 'not choose';
    if(B_is_ai){
        Btype = 'ai';
        var botlist = JSON.parse(localStorage.getItem('botlist'));
        Bbot = botlist[B_ai_id];
        Bcur = 'AI '+Bbot.name;
        // do something ai
    }
    if(B_is_remote){
        Btype = 'remote';
        // do something remote

    }




    $('#Aid').text(myid);
    $('#Bid').text('Opponent');
    $('#Acur').text(Acur);
    $('#Bcur').text(Bcur);

    render_play();

}


$(start);
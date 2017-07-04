'user strict'

var ipcRenderer = require('electron').ipcRenderer;
var Red7 = require('./red7.js');
var Bot = require('./mybot.js');
let g;
var A={};
var B={};
let selectable = false;
A.x ="A"
B.x = "B"
A.name= localStorage.getItem('username');
B.name= "Chenyao2333";
A.gid=0;
B.gid=1;
A.score=0;
B.score=0;
A.type = "human"
B.type = "remote"

ipcRenderer.send("sign_up", localStorage.getItem("uuid"), A.name);
ipcRenderer.send("update_status", "fighting", B.name);


// remote
A.roundtime = 2;
B.roundtime = 100;
var round_num=0;
var start_time = 0;
var _do_operation;
var removed_cards = [];
var round_wait_time = 3; // 两场间隔时间
var _cid; // active cid
var _card,_rule_card; // active cards
var hideB = true; // hide op
var last_rule_card=0;
var AI_wait_time = 100; // 毫秒
var return_wait_time=5;
var _op_timeout = false;

var backparam = {}

var game_type;
// 自己是A
// 排序
// 观战
// 防止双开

ipcRenderer.once("opponet_disconnected", function(e, op) {
    if (op === B.name) {
        _op_timeout = true;
        A.score = 40;
        start();
    }
});




var color={
    7: "red",
    6: "orange",
    5: "yellow",
    4: "green",
    3: "blue",
    2: "indigo",
    1: "violet"
};
var rule={
    7:"HIGHEST CARD",
    6:"CARDS OF ONE NUMBER",
    5:"CARDS OF ONE COLOR",
    4:"MOST EVEN CARDS",
    3:"CARDS OF ALL DIFFERENT COLORS",
    2:"CARDS THAT FORM A RUN",
    1:"MOST CARDS BELOW 4"
};

var rule_color={
    7:"rgb(203,38,59)",
    6:"rgb(253,166,79)",
    5:"rgb(245,224,58)",
    4:"rgb(66,173,51)",
    3:"rgb(83,208,252)",
    2:"rgb(48,130,200)",
    1: "rgb(126,72,191)"
};

function save_botlist(botlist){
    for(var x in botlist){
        botlist[x].botid=x;
    }
    localStorage.setItem('botlist',JSON.stringify(botlist));
}

function getUrlVar(key){
	var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search); 
	return result && unescape(result[1]) || ""; 
}

function testurl(key){
    var ret = getUrlVar(key);
    if(ret === "") return false;
    else return true;
}

function arrcopy(ret,a){ // ret must be []
    for(var x of a){
        ret.push(x);
    }
}

function hands2html(arr, hide, selectable){
    if(typeof(arr) === 'number') arr = g.hands[arr];
    var ret=""
    for( var x of arr){
        var c = x%10;
        var n = parseInt(x/10);
        if(hide === true){
            ret+=`<div class="card-lg card-${color[c]} card-${n}  card-hand" id="card${x}" onclick="select_card(${x})" style="width:60px;"> <img src="./static/img/hide.png" width=100%>   </div>`
        }else{
            if(selectable === true){
                ret+=`<div class="card-lg card-${color[c]} card-${n}  card-hand" id="card${x}" onclick="select_card(${x})" style="width:60px;cursor:pointer;"> <img src="./static/img/cards/${x}.png" width=100%>   </div>`
            }else{
                ret+=`<div class="card-lg card-${color[c]} card-${n}  card-hand" id="card${x}" onclick="select_card(${x})" style="width:60px;cursor:default;"> <img src="./static/img/cards/${x}.png" width=100%>   </div>`
            }
            
        }
        
    }
    return ret
}

function palette2html(arr){
    if(typeof(arr) === 'number') arr = g.palette[arr];
    var rule = _rule_card || last_rule_card || 77;
    rule = rule % 10;
    highest = g.get_top[rule](arr);
    console.log('rule:'+rule + ' '+highest)
    var ret=""
    for(var x of arr ){
        var c = x%10;
        var n = parseInt(x/10);
        var highlight = '';
        if(highest.indexOf(x) >= 0){
            highlight = 'highlight';
        }
        ret+=`<div class="card-sm card-${color[c]} card-${n} card-palette ${highlight}" id="card${x}" style="width:40px;"> <img src="./static/img/cards-sm/${x}.png" width=100%></div>`
    }
    return ret
}

function activebtn(btn){
    $(btn).removeClass('disabled');
    $(btn).addClass('btn-raised');
}
function disablebtn(btn){
    $(btn).addClass('disabled');
    $(btn).removeClass('btn-raised');

}

function click_withdraw(){
    console.log('withdraw');
    render_init();
    disablebtn('#play');
    disablebtn('#play-card');
    disablebtn('#play-rule');
    disablebtn('#undo');
    _do_operation(0,0);
}
function click_play(){
    console.log('click play '+_card+' '+_rule_card);
    $('#op-pan').hide();
    render_init();
    disablebtn('#play');
    disablebtn('#play-card');
    disablebtn('#play-rule');
    disablebtn('#undo');
    _do_operation(_card,_rule_card);
}

function click_card(){
    console.log('click play '+_cid);
    _card = _cid;
    if(_card === _rule_card){
        _rule_card = 0;
    }
    var hands = [];
    arrcopy(hands,g.hands[A.gid]);
    var pos = hands.indexOf(_card);
    if(pos>=0){
        hands.splice(pos,1);
    }
    pos = hands.indexOf(_rule_card);
    if(pos>=0){
        hands.splice(pos,1);
    }
    var palette = [];
    arrcopy(palette,g.palette[A.gid]);
    if(_card > 0) palette.push(_card);
    $('#paletteA').html(palette2html(palette));
    $('#paletteB').html(palette2html(g.palette[B.gid]));
    $('#handA').html(hands2html(hands, false, selectable));
    // 动画
    if(g.try_play(A.gid,_card,_rule_card)){
        activebtn('#play');
    }else{
        disablebtn('#play')
    }
    activebtn('#undo');
    disablebtn('#play-card');
    disablebtn('#play-rule');


}


function click_rule(){
    console.log('click rule '+_cid);
    _rule_card = _cid;
    if(_card === _rule_card){
        _card = 0;
    }
    var hands = [];
    arrcopy(hands,g.hands[A.gid]);
    var pos = hands.indexOf(_card);
    if(pos>=0){
        hands.splice(pos,1);
    }
    pos = hands.indexOf(_rule_card);
    if(pos>=0){
        hands.splice(pos,1);
    }
    var palette = [];
    arrcopy(palette,g.palette[A.gid]);
    if(_card > 0) palette.push(_card);
    $('#paletteA').html(palette2html(palette));
    $('#paletteB').html(palette2html(g.palette[B.gid]));
    $('#handA').html(hands2html(hands,false,selectable));
    $('#rule').html(`<div><img src="./static/img/cards/${_rule_card}.png" height=40px> </div>`+`<div class="rule-text">${rule[_rule_card%10]}</div>`)
    $('#rule').css('color',rule_color[_rule_card%10])
    // 动画
    if(g.try_play(A.gid,_card,_rule_card)){
        activebtn('#play');
    }else{
        disablebtn('#play')
    }
    activebtn('#undo');
    disablebtn('#play-card');
    disablebtn('#play-rule');
    
}


function click_undo(){
    console.log('click undo '+_cid);
    _card = _rule_card = 0;
    render_init();
    disablebtn('#play');
    disablebtn('#play-card');
    disablebtn('#play-rule');
    disablebtn('#undo');
}

function select_card(cid){
    if(!selectable) return;
    if(g.hands[A.gid].indexOf(cid)<0) return;
    console.log('choose'+cid);
    _cid = cid;
    // todo
    if(!$("#card"+cid).hasClass('card-select')){
        $(".card-hand").removeClass('card-select');
        $("#card"+cid).addClass('card-select');
        activebtn('#play-card');
        activebtn('#play-rule');

    }else{
        $("#card"+cid).removeClass('card-select');
        disablebtn('#play-card');
        disablebtn('#play-rule');

    }
}



function render_init(){
    $('#nameA').html('<nobr>'+A.name+'</nobr>');
    $('#nameB').html('<nobr>'+B.name+'</nobr>');
    $('#scoreA').text(A.score);
    $('#scoreB').text(B.score);
// 是否要给牌排序
    
    $("#handA").html(hands2html(A.gid,false,selectable));
    $("#handB").html(hands2html(B.gid,hideB,false));

    $("#paletteA").html(palette2html(A.gid));
    $('#paletteB').html(palette2html(B.gid));
    
    $('#rule').html(`<div><img src="./static/img/cards/${last_rule_card}.png" height=40px> </div>`+`<div class="rule-text">${rule[g.current_rule]}</div>`)
    $('#rule').css('color',rule_color[g.current_rule])
}

function show_win(winner){
    $.alert({
        title: `${winner.name} win!`,
        content: `${winner.name} win this round! Next round will start in ${round_wait_time}s.`,
        autoClose: `close|${round_wait_time *1000 -1000}`,
        buttons:{
            close : function(){
                console.log('message_box close');
            }
        }
    })
    
}

function do_timeout(X,do_operation) {
    $('#clock'+X.x).text('timeout!');
    console.log(X);
    if(X.type === 'remote' || X.type === 'bot' ){
        //不用干
    }else{
        render_init();
        do_operation(0, 0);
    }    
}

function getNow(){
    var  _date = new Date();
    return _date.getTime();
}

function start_clock(r,X,do_operation){
    var end_time = getNow() + X.roundtime * 1000;
    function update_clock(){
        var now = getNow();

        if(round_num !== r){
            $('#clock'+X.x).text('');
            return;
        }
        if(now> end_time){
            do_timeout(X,do_operation);
            return;
        }
        $('#clock'+X.x).html('<div style="margin-right:4px;"><i class="material-icons">alarm</i></div>'+'<div style="font-size:1.2em;">'+parseInt((end_time-now)/1000)+'</div>');
        setTimeout(update_clock,200);
    }
    setTimeout( update_clock , 0);

}

function Run(X,nxtX){
    console.log('Run '+X.gid);
    var r = round_num;

    var do_operation = function(card,rule_card){
        if(r!==round_num) return;
        round_num += 1;
        selectable = false;
        if(typeof(card)!=='number' || !(card>=0 && card<=77)){
            card = 0;
        }
        if(typeof(rule_card)!=='number'||!(rule_card>=0 && rule_card<=77)){
            rule_card = 0;
        }
        if (nxtX.type == "remote") {
            ipcRenderer.send("debug", "before forward");
            ipcRenderer.send("forward", nxtX.name, "do_operation", [card, rule_card]);
            ipcRenderer.send("debug", "after forward")
        }
        var ret = g.play(X.gid,card,rule_card);
        if(ret === false){
            show_win(nxtX);
            var sc = 0;
            var highest = g.get_player_highest(nxtX.gid, 0);
            highest.map(function(x){
                removed_cards.push(x);
                sc += parseInt(x/10);
            })
            nxtX.score += sc;
            $('#scoreA').text(A.score);
            $('#scoreB').text(B.score);
            // 设置 start_time
            start_time = getNow()+round_wait_time*1000;
            start();
        }else{
            //加动画 鲁棒的动画
            if(rule_card>0) {
                _rule_card = 0;
                last_rule_card = rule_card;
            }
            render_init();
            Run(nxtX,X);
        }

    }
    
    _do_operation = do_operation;

    // 开计时器
    // 如果是A并且human监听操作，
    // 如果是bot，调mybot获取操作，并执行。
    // 如果B是remote,调网络库获取操作，并执行。
    start_clock(round_num,X,do_operation);
    if(X.type === "bot"){
        var bot = new Bot(X.bot_path);
        bot.run(g.gen_input(X.gid), X.roundtime * 1000, function (err, card, rule_card) {
            if (err !== 0) {
                console.log("error: " + err+' '+card+' '+rule_card);
                setTimeout(function () {
                    _do_operation(0, 0);
                }, 0);
            }
            console.log("do operation card = " + card + "\trule_card = " + rule_card);
            setTimeout(function () {
                _do_operation(card, rule_card);
            }, AI_wait_time);
        });
    }else if(X.type === "human"){
        selectable = true;
        render_init();
        _card = _rule_card = 0 ;
        _hands = [];
        arrcopy(_hands,g.hands[X.gid]);
        _palette = [];
        arrcopy(_palette,g.hands[X.gid]);
        $('#op-pan').show();
        
    }else if(X.type === "remote"){
        ipcRenderer.once("do_operation", function (e, [card, rule_card]) {
            console.log("in chenyao's sb do_operation " + card + " " + rule_card);
            _do_operation(card, rule_card);
        });
        ipcRenderer.send("register", "do_operation");
    }

}

function start(){
    $('#op-pan').hide();
    if(A.score >= 40 || B.score >=40){
        //处理获胜。
        var winner;
        if(A.score>B.score){
            winner =A;
        }else winner = B;
        
        if(_op_timeout){
            winner = A;
            
            $.alert({
                title: `${winner.name} win!`,
                content: `${B.name} left. ${winner.name} win this game! Automatic return in ${return_wait_time}s.`,
                autoClose: `close|${return_wait_time*1000 -1000}`,
                buttons:{
                    close : function(){
                        console.log('message_box close');
                    }
                }
            })
        }else{
            $.alert({
                title: `${winner.name} win!`,
                content: `${winner.name} win this game! Automatic return in ${return_wait_time}s.`,
                autoClose: `close|${return_wait_time*1000 -1000}`,
                buttons:{
                    close : function(){
                        console.log('message_box close');
                    }
                }
            })


        }
        

        setTimeout(function() {
            location.href = './matching.html?'+$.param(backparam);
        }, return_wait_time*1000);

        var botlist = JSON.parse(localStorage.getItem('botlist'));
        if(A.type === 'bot'){
            //console.log(botlist[A.botid]);
            if(winner.x === 'A')
                botlist[A.botid].win+=1;
            botlist[A.botid].play_num+=1;
        }
        if(B.type === 'bot'){
            //console.log(botlist[B.botid]);
            if(winner.x === 'B')
                botlist[B.botid].win+=1;
            botlist[B.botid].play_num+=1;
        }
        save_botlist(botlist);
        console.log('获胜');
        
        return;
    }

    if (A.gid === 0) [score_0, score_1] = [A.score, B.score];
    else [score_1, score_0] = [A.score, B.score];
    g = new Red7(2, removed_cards, score_0, score_1);
    last_rule_card = 0;
    _cid=0;
    _card = _rule_card =0;
    

    var _do = function() {
        if(getNow()>start_time){
            render_init();
            var current_gid = (g.get_winner(0)+1)%g.num_players;
            if(current_gid === A.gid) Run(A,B);
            else Run(B,A);
            return;
        }else{
            setTimeout(_do, 100);
        }
   }

    if(B.type === "remote"){
        if (A.name < B.name) {
            ipcRenderer.send("forward", B.name, "set_g", g);
            A.gid = 0;
            B.gid = 1;
        } else {
            A.gid = 1;
            B.gid = 0;
            ipcRenderer.once("set_g", function (e, rg) { 
                g.current_rule = rg.current_rule;
                g.hands = rg.hands;
                g.palette = rg.palette;
                _do();
            });
            ipcRenderer.send("register", "set_g");
        }
    } else {
        _do();
    }
    
}
function receive(){
    var url = testurl('url');
    if(url){
        game_type = getUrlVar('game_type');
        if(game_type === 'human_ai'){
            A.name = getUrlVar('Aname');
            B.name = getUrlVar('Bname');
            A.gid = parseInt(getUrlVar('Agid'))
            B.gid = parseInt(getUrlVar('Bgid'));
            A.roundtime =parseInt(getUrlVar('Aroundtime'));
            B.roundtime = parseInt(getUrlVar('Broundtime'));
            AI_wait_time = parseInt(getUrlVar('AIwaittime'));
            var _hideB = getUrlVar('hideB');
            if(_hideB === "true") hideB = true;
            else if(_hideB === "false") hideB = false;
            else{
                console.log('[!] _hideB: ',_hideB);
            }
            A.type = "human";
            B.type = "bot";
            var botid = parseInt(getUrlVar("Bbotid"));
            var botlist = JSON.parse(localStorage.getItem('botlist'));
            B.bot_path = botlist[botid].bot_path;
            B.botid = botid;

            // back
            backparam.myid = A.name;
            backparam.A_is_human = 'aaa';
            backparam.B_is_ai = 'aaa';
            backparam.B_ai_id = botid;

        }else if(game_type === 'ai_ai'){
            A.name = getUrlVar('Aname');
            B.name = getUrlVar('Bname');
            A.gid = parseInt(getUrlVar('Agid'))
            B.gid = parseInt(getUrlVar('Bgid'));
            A.roundtime =parseInt(getUrlVar('Aroundtime'));
            B.roundtime = parseInt(getUrlVar('Broundtime'));
            AI_wait_time = parseInt(getUrlVar('AIwaittime'));
            var _hideB = getUrlVar('hideB');
            if(_hideB === "true") hideB = true;
            else if(_hideB === "false") hideB = false;
            else{
                console.log('[!] _hideB: ',_hideB);
            }
            A.type = "bot";
            B.type = "bot";
            var Abotid = parseInt(getUrlVar("Abotid"));
            var Bbotid = parseInt(getUrlVar("Bbotid"));
            var botlist = JSON.parse(localStorage.getItem('botlist'));
            A.bot_path = botlist[Abotid].bot_path;
            A.botid = Abotid;
            B.bot_path = botlist[Bbotid].bot_path;
            B.botid = Bbotid;

            backparam.myid = getUrlVar('myid');
            backparam.A_is_ai = 'aaa';
            backparam.A_ai_id = Abotid;
            backparam.B_is_ai = 'aaa';
            backparam.B_ai_id = Bbotid;
            console.log('path');
            console.log(A.bot_path);
            console.log(B.bot_path);
            // debug
            //A.roundtime = 30;
            //round_wait_time = 100;
            //return_wait_time = 100;

        }
        

    }
}

$(receive);
$(start);

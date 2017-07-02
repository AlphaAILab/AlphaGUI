'user strict'

var Red7 = require('./red7.js');
var Bot = require('./mybot.js');
let g;
var A={};
var B={};
let selectable = false;
A.x ="A"
B.x = "B"
A.name= "ZRT";
B.name= "Chenyao";
A.gid=0;
B.gid=1;
A.score=23;
B.score=39;
A.type = "human"
B.type = "bot"
// remote
A.roundtime = 60;
B.roundtime = 20;
var round_num=0;
var start_time = 0;
var _do_operation;
var removed_cards = [];
var round_wait_time = 3; // 两场间隔时间
var _cid; // active cid
var _card,_rule_card; // active cards


// 自己是A




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
var img={
    7: "./static/img/max.png",
    6: "./static/img/333.png",
    5: "./static/img/max.png",
    4: "./static/img/max.png",
    3: "./static/img/max.png",
    2: "./static/img/max.png",
    1: "./static/img/max.png"
}

function arrcopy(ret,a){ // ret must be []
    for(var x of a){
        ret.push(x);
    }
}

function hands2html(arr){
    if(typeof(arr) === 'number') arr = g.hands[arr];
    var ret=""
    for( var x of arr){
        var c = x%10;
        var n = parseInt(x/10);
        ret+=`<div class="card-lg card-${color[c]} card-${n} well card-hand" id="card${x}" onclick="select_card(${x})"> <span>${n}</span> <br> <img src="./loading.svg" width="30px">   </div>`
    }
    return ret
}

function palette2html(arr){
    if(typeof(arr) === 'number') arr = g.palette[arr];
    var ret=""
    for(var x of arr ){
        var c = x%10;
        var n = parseInt(x/10);
        ret+=`<div class="card-sm card-${color[c]} card-${n} well card-palette" id="card${x}"> <span>${n}</span> <br> <img src="./loading.svg" width="15px">   </div>`
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
    $('#handA').html(hands2html(hands));
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
    $('#handA').html(hands2html(hands));
    $('#rule').html(`${rule[_rule_card%10]}`)
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
    render_init();
    disablebtn('#play');
    disablebtn('#play-card');
    disablebtn('#play-rule');
    disablebtn('#undo');
    _card = _rule_card = 0;
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
    $('#nameA').text(A.name);
    $('#nameB').text(B.name);
    $('#scoreA').text(A.score);
    $('#scoreB').text(B.score);
// 是否要给牌排序
    
    $("#handA").html(hands2html(A.gid));
    $("#handB").html(hands2html(B.gid));

    $("#paletteA").html(palette2html(A.gid));
    $('#paletteB').html(palette2html(B.gid));
    
    $('#rule').html(`${rule[g.current_rule]}`)
}

function show_win(winner){
    $('#rule').text(winner.name + " win!");
}

function do_timeout(X,do_operation) {
    $('#clock'+X.x).text('timeout!');
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
        $('#clock'+X.x).text((end_time-now)/1000);
        setTimeout(update_clock,100);
    }
    setTimeout( update_clock , 100);

}

function Run(X,nxtX){
    console.log('Run '+X.gid);
    var r = round_num;

    var do_operation = function(card,rule_card){
        if(r!==round_num) return;
        round_num += 1;
        selectable = false;
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
        var bot = new Bot("./trivial.exe");
        bot.run(g.gen_input(X.gid), X.roundtime * 1000, function (err, card, rule_card) {
            if (err !== 0) {
                console.log("error: " + err);
            }
            console.log("do opearation card = " + card + "\trule_card = " + rule_card);
            setTimeout(function () {
                do_operation(card, rule_card);
            }, 2000);
        });
    }else if(X.type === "human"){
        selectable = true;
        _card = _rule_card = 0 ;
        _hands = [];
        arrcopy(_hands,g.hands[X.gid]);
        _palette = [];
        arrcopy(_palette,g.hands[X.gid]);
        $('#op-pan').show();
        
    }else if(X.type === "remote"){
        // 类似mybot
    }

}

function start(){
    $('#op-pan').hide();
    if(A.score >= 40 || B.score >=40){
        //处理获胜。
        console.log('获胜');
        
        return;
    }

    g = new Red7(2,[]);
    
    if(B.type === "remote"){
        // wangluo
    
        //wangluo end
    }

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
    _do();
    
}


$(start);

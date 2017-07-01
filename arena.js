'user strict'

var Red7 = require('./red7.js');
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
A.roundtime = 20;
B.roundtime = 20;
var round_num=0;
var start_time = 0;
var _do_operation;



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

function hands2html(gid){
    var ret=""
    for( var x of g.hands[gid]){
        var c = x%10;
        var n = parseInt(x/10);
        ret+=`<div class="card-lg card-${color[c]} card-${n} well card-hand" id="card${x}" onclick="select_card(${x})"> <span>${n}</span> <br> <img src="./loading.svg" width="30px">   </div>`
    }
    return ret
}

function palette2html(gid){
    var ret=""
    for(var x of g.palette[gid]){
        var c = x%10;
        var n = parseInt(x/10);
        ret+=`<div class="card-sm card-${color[c]} card-${n} well card-palette" id="card${x}"> <span>${n}</span> <br> <img src="./loading.svg" width="15px">   </div>`
    }
    return ret
}

function select_card(cid){
    if(!selectable) return;
    if(g.hands[A.gid].indexOf(cid)<0) return;
    console.log('choose'+cid);

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
    if(X.type === 'remote' || X.type === 'bot' ){
        // 刷个 00 红色的表
    }else{
        do_operation(0, 0);
    }
    
}


function start_clock(r,X,do_operation){
    // end_time = now + X.roundtime;
    function update_clock(){
        // 获取now

        if(round_num !== r){
            $('#clock').text('');
            return;
        }
        if(now> end_time){
            do_timeout(X,do_operation);
            return;
        }
        // update end_time - now
        setTimeout(update_clock,100);
    }
    setTimeout( update_clock , 100);

}

function Run(X,nxtX){

    var do_operation = function(card,rule_card){
        if(r!==round_num) return;
        round_num += 1;
        selectable = false;
        var ret = g.play(X.gid,card,rule_card);
        if(ret === false){
            show_win(nxtX);
            nxtX.score += g.get_player_highest(nxtX.gid, 0);
            // 设置 start_time
            start();
        }else{
            //加动画 鲁棒的动画

            Run(nxtX,X);
        }

    }

    // 开计时器
    // 如果是A并且human监听操作，
    // 如果是bot，调mybot获取操作，并执行。
    // 如果B是remote,调网络库获取操作，并执行。
    start_clock(round_num,X,do_operation);
    if(X.type === "bot"){
        // my bot 操作
    }else if(X.type === "human"){
        _do_operation = do_operation;
        selectable = true;
        
    }else if(X.type === "remote"){
        // 类似mybot
    }

}

function start(){
    if(A.score >= 40 || B.score >=40){
        //处理获胜。
        console.log('获胜');
        
        return;
    }

    // wangluo
    
    //wangluo end


    g = new Red7(2,[]);
    
    /// start_time 处理 
    render_init();

    var current_gid = (g.get_winner()+1)%g.num_players;
    if(current_gid === A.gid) Run(A,B);
    else Run(B,A);
}

// bind_card

$(start);
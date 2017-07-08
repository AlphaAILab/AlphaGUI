'use strict'

var Red7 = require('./red7.js');
var Bot = require('./mybot.js');
let g

// var bot1 = 3
// var bot2 = 4
// var bot1path = ''
// var bot2path = ''
// var roundnumber = 100
// var is_long_game = true
// let g
// var bot1_win = 0
// var bot2_win = 0
// var roundtime = 2

// function new_round(){
//     var removed_cards = []
//     var score_0 = 0
//     var score_1 = 0
//     g = new Red7(2, removed_cards, score_0, score_1);
//     var current_gid = (g.get_winner(0)+1)%g.num_players;
//     for(;;){
//         var bot
//         var gid
//         if(current_gid === 0){
//             bot = new Bot(bot1path)
//             gid = 0
//         }else{
//             bot = new Bot(bot1path)
//             gid = 1
//         }
//         bot.run(g.gen_input(gid), roundtime * 1000, function (err, card, rule_card) {
//             if (err !== 0) {
//                 console.log("error: " + err+' '+card+' '+rule_card);
//                 setTimeout(function () {
//                     _do_operation(0, 0);
//                 }, 0);
//             }
//             console.log("do operation card = " + card + "\trule_card = " + rule_card);
//             setTimeout(function () {
//                 _do_operation(card, rule_card);
//             }, AI_wait_time);
//         });

//     }
// }

// function go_(){
//     for(var i =0 ;i< roundnumber ;i ++){
//         new_round();
//         console.log(`${bot1_win} ${bot2_win}`);

//     }
// }

// function start(){
//     console.log('start')
//     bot1path = JSON.parse(localStorage.getItem('botlist'))[bot1]
//     bot2path = JSON.parse(localStorage.getItem('botlist'))[bot2]
//     go_();

// }

// $(start);

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
A.type = "bot"
B.type = "bot"
A.botid = 3
B.botid = 4
A.roundtime = 2
B.roundtime = 2
A.win = 0
B.win =0

var _do_operation;
var removed_cards = [];

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


function getNow(){
    var  _date = new Date();
    return _date.getTime();
}


function Run(X,nxtX){
    
    var do_operation = function(card,rule_card){
        if(typeof(card)!=='number' || !(card>=0 && card<=77)){
            card = 0;
        }
        if(typeof(rule_card)!=='number'||!(rule_card>=0 && rule_card<=77)){
            rule_card = 0;
        }
        var ret = g.play(X.gid,card,rule_card);
        if(ret === false){
            var sc = 0;
            var highest = g.get_player_highest(nxtX.gid, 0);
            highest.map(function(x){
                removed_cards.push(x);
                sc += parseInt(x/10);
            })
            nxtX.score += sc;
            start();
        }else{
            Run(nxtX,X);
        }

    }
    
    _do_operation = do_operation;

    if(X.type === "bot"){
        var bot = new Bot(X.bot_path);
        bot.run(g.gen_input(X.gid), X.roundtime * 1000, function (err, card, rule_card) {
            if (err !== 0) {
                console.log("error: " + err+' '+card+' '+rule_card);
                _do_operation(0, 0);
            }
            // console.log(X.name+" do operation card = " + card + "\trule_card = " + rule_card);
            _do_operation(card, rule_card);
        });
    }

}

function save_botlist(botlist){
    for(var x in botlist){
        botlist[x].botid=x;
    }
    localStorage.setItem('botlist',JSON.stringify(botlist));
}
function start(){

    A.bot_path = JSON.parse(localStorage.getItem('botlist'))[A.botid].bot_path
    B.bot_path = JSON.parse(localStorage.getItem('botlist'))[B.botid].bot_path

    if(A.score >= 40 || B.score >=40){
        var winner;
        if(A.score>B.score){
            winner =A;
            A.win+=1
        }else{
             winner = B;
            B.win+=1
        }
        

        console.log(`${A.win} ${B.win}`);


        
        new_round();// 

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
        
        return;
    }

    g = new Red7(2, removed_cards, A.score, B.score);
    

    var current_gid = (g.get_winner(0)+1)%g.num_players;
    if(current_gid === A.gid) Run(A,B);
    else Run(B,A);
    return;
}

var roundnumber = 100
var _round = 0
function new_round(){
    _round ++
    A.score  = B.score = 0
    removed_cards = []
    if(roundnumber === _round){
        return;
    }else{
        start();
    }
    // clear then check and start
    // console.log('debug new round')
}

$(start);

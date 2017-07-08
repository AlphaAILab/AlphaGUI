'use strict'

var Red7 = require('./red7.js');
var Bot = require('./mybot.js');
let g

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
var detail,full

var _do_operation;
var removed_cards = [];
var _score = []
var _full = []

function Once(bot_path1,bot_path2,roundtime,_detail,_full){
    A.bot_path = bot_path1
    B.bot_path = bot_path2
    A.roundtime = B.roundtime = roundtime
    detail = _detail
    full = _full
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
        if(full) _full.push([X.gid,rule_card,card]+'\n');
        if(ret === false){
            var sc = 0;
            var highest = g.get_player_highest(nxtX.gid, 0);
            highest.map(function(x){
                removed_cards.push(x);
                sc += parseInt(x/10);
            })
            nxtX.score += sc;
         if(detail)_score.push([A.score,B.score])
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

var _callback
function arrcopy(ret,a){ // ret must be []
    for(var x of a){
        ret.push(x);
    }
    return ret
}
function start(){


    if(A.score >= 40 || B.score >=40){
        var winner;
        if(A.score>B.score){
            winner =A;
            A.win+=1
        }else{
             winner = B;
            B.win+=1
        }
        _callback(winner.gid,_score,_full)
        return;
    }

    g = new Red7(2, removed_cards, A.score, B.score);
    
    if(full) _full.push('hands0 '+ arrcopy([],g.hands[0])+'\n')
    if(full) _full.push('palette0 '+arrcopy([],g.palette[0])+'\n')
    if(full) _full.push('hands1 '+arrcopy([],g.hands[1])+'\n')
    if(full) _full.push('palette1 '+arrcopy([],g.palette[1])+'\n')
    var current_gid = (g.get_winner(0)+1)%g.num_players;
    if(current_gid === A.gid) Run(A,B);
    else Run(B,A);
    return;
}

function _run(callback){ // callback(winner,score)

    A.score=0;
    B.score=0;
    removed_cards = []
    _score = []
    _callback = callback
    _full = []
    start()
}


Once.prototype = {
    run : _run
}
module.exports = Once;

'use strict'

function Game(num_players, removed_cards, score_0, score_1) {
    this.num_players = num_players;
    this.hands = new Array(num_players);
    this.palette = new Array(num_players);
    this.current_rule = 7;
    this.duration = ""
    //this.log_string = "";

    var whole = []
    for (var i = 1; i <= 7; i++) {
        for (var j = 1; j <= 7; j++) {
            var c = i*10 + j;
            if (removed_cards.indexOf(c) >= 0) {
                continue;
            }
            whole.push(c);
        }
    }

    for (var i = 0; i < whole.length; i++) {
        var x = Math.floor(Math.random() * (i+1));
        [whole[x], whole[i]] = [whole[i], whole[x]];
    }

    for (var player = 0; player < this.num_players; player++) {
        this.hands[player] = [];
        this.palette[player] = [whole.pop()];
        for (var i = 0; i < 7; i++) {
            this.hands[player].push(whole.pop());
        }
    }

    this.duration += score_0 + " " + score_1 + " \n";
    this.duration += whole.length + " ";
    for (var x of whole) this.duration += x + " ";
    this.duration += "\n";


    //console.log(whole);
    //console.log(this.hands);
    //console.log(this.palette);
}

function max_element(a){
    //console.log(a);
    var tmp = a[0];
    for(var x of a){
        //console.log("x = " + x);
        if(x>tmp) tmp=x;
    }
    return tmp;
}

function compare(a,b){
    if (a.length===0) return false;
  else if (a.length>b.length) return true;
  else if (a.length<b.length) return false;
  else return (max_element(a) > max_element(b));
}

function red(a){
    // Highest
    var r=[];
    r.push(max_element(a));
    return r;
}

function orange(a){
    // same number
    var n =[[],[],[],[],[],[],[],[]];
    for(var x of a){
        n[Math.floor(x/10)].push(x);
    }
    var best=n[1];
    for(var i=2;i<8;i++){
        if(compare(n[i],best)) best=n[i];
    }
    return best;
}

function yellow(a){
    // same color
    var n =[[],[],[],[],[],[],[],[]];
    for(var x of a){
        n[x%10].push(x);
    }
    var best=n[1];
    for(var i=2;i<8;i++){
        if(compare(n[i],best)) best=n[i];
    }
    return best;
}

function green(a){
    // even number
    var r=[];
    for(var x of a){
        if(Math.floor(x/10)%2 === 0) r.push(x);
    }
    return r;
}

function blue(a){
    // different color
    var m_color =Array(8).fill(0);
    for(var x of a){
        if(x>m_color[x%10]) m_color[x%10]=x;
    }
    var r = [];
    for (var x of m_color) {
        if (x > 0) r.push(x);
    }
    return r;
}

function indigo(a) {
    // in a row
    var m_number = Array(8).fill(0);
    for (var x of a) {
        if (x > m_number[Math.floor(x/10)]) m_number[Math.floor(x/10)] = x;
    }

    var best = [], current = [];
    for (var i = 1; i < 8; i++) {
        if (m_number[i] === 0) current = [];
        else {
            current.push(m_number[i]);
            if (compare(current, best)) best = current;
        }
    }
    return best;
}

function violet(a) {
    // below 4
    var r = [];
    for (var x of a) {
        if (Math.floor(x/10) < 4) r.push(x);
    }
    return r;
}

var _get_top = {
    7: red,
    6: orange,
    5: yellow,
    4: green,
    3: blue,
    2: indigo,
    1: violet
};


function _get_winner(rule){
    // palette
    if (rule === 0) rule = this.current_rule;
    var best_hand = [];
    var win = -1;

    for (var i = 0; i < this.num_players; i++) {
        var cur = _get_top[rule](this.palette[i]);
        if (compare(cur, best_hand)) {
            best_hand = cur;
            win = i;
        }
    }
    return win; 
}

function _get_player_highest(player, rule) {
    if (rule === 0) rule = this.current_rule;
    return _get_top[rule](this.palette[player]);
}

function _try_play(player, card, rule_card) {
    var hands = [];
    for (var x of this.hands[player]) hands.push(x);

    if (card > 0) {
        var cid = hands.indexOf(card);
        if (cid < 0) return false;
        hands.splice(cid, 1);
    }
    if (rule_card > 0) {
        var cid = hands.indexOf(rule_card);
        if (cid < 0) return false;
        hands.splice(cid, 1);
    }
    
    var winning = false;
    if (card > 0) this.palette[player].push(card);
    winning = this.get_winner(rule_card % 10) === player;
    if (card > 0) this.palette[player].pop();

    return winning;
}

function _play(player, card, rule_card) {
    if (card > 0) {
        var cid = this.hands[player].indexOf(card);
        if (cid < 0) {
            console.log("Card no in player " + player + "'s hand");
            card = 0;
        } else {
            this.palette[player].push(card);
            this.hands[player].splice(cid, 1);
        }
    }
    if (rule_card > 0) {
        var cid = this.hands[player].indexOf(rule_card);
        if (cid < 0) {
            console.log("Rule card not in player " + player + "'s hand");
            rule_card = 0;
        } else {
            this.hands[player].splice(cid, 1);
        }
    }
    var current_winning = false;
    if (card > 0 || rule_card > 0) {
        var rule = rule_card % 10;
        if (this.get_winner(rule) === player) {
            if (rule_card > 0) {
                this.current_rule = rule;
            }
            current_winning = true;
        }
    }

    this.duration += player + " " + rule_card + " " + card + "\n";

    return current_winning;
}

function _gen_input(player) {
    var s = "";
    s += this.num_players + " " + player + "\n";
    s += this.current_rule  + "\n";

    s += this.hands[player].length + " ";
    for (var x of this.hands[player]) s += x + " ";
    s += "\n"

    for (var i = 0; i < this.num_players; i++) {
        s += this.hands[i].length + "\n";

        s += this.palette[i].length + " ";
        for (var x of this.palette[i]) s += x + " ";
        s += "\n";
    }

    s += this.duration;
    return s;
}

Game.prototype = {
    constructor: Game,
    get_winner: _get_winner,
    get_player_highest: _get_player_highest,
    try_play: _try_play,
    play: _play,
    gen_input: _gen_input
}

//Game(2, [11,12,13,14,15,16,17])

module.exports = Game;
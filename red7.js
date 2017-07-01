'use strict'
function Game(num_players, removed_cards) {
    this.num_players = num_players;
    this.hands = new Array(num_players);
    this.palette = new Array(num_players);
    this.current_rule = 7;
    //this.log_string = "";

    whole = []
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
        x = Math.floor(Math.random() * (i+1));
        [whole[x], whole[i]] = [whole[i], whole[x]];
    }

    for (var player = 0; player < this.num_players; player++) {
        this.hands[player] = [];
        this.palette[player] = whole.pop();
        for (var i = 0; i < 7; i++) {
            this.hands[player].push(whole.pop());
        }
    }

    //console.log(whole);
    console.log(this.hands);
    console.log(this.palette);
}

function max_element(a){
    var tmp = a[0];
    for(var x of a){
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
    r=[];
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



function winner(rule){
    // palette
    
}

Game.prototype = {
    constructor: Game,
    winner: winner
}

Game(2, [11,12,13,14,15,16,17])

module.exports = {
    Game: Game
}
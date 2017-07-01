var Red7 = require("./red7.js");
var g = new Red7.Game(2, []);

console.log(g);


p = 0;
for (var x of g.hands[p]) {
    for (var y of g.hands[p]) {
        console.log("x = " + x + " y = " + y);
        console.log(g.try_play(p, x, y));
    }
}
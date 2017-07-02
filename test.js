var Red7 = require("./red7.js");
var Bot = require("./mybot.js");
var g = new Red7(2, [], 0, 0);

console.log(g);
win = g.get_winner(0);
p = (win + 1) % 2;
console.log(g.gen_input(p));


bot = new Bot("./trivial.exe");
bot.run(g.gen_input(p), 3000, function (err, card, rule_card) {
    console.log(err);
    console.log("card = " + card + "\trule_card = " + rule_card);
})

/*
p = 0;
for (var x of g.hands[p]) {
    for (var y of g.hands[p]) {
        console.log("x = " + x + " y = " + y);
        console.log(g.try_play(p, x, y));
    }
}
*/

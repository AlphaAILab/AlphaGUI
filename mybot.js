'use strict'

var spawn = require("child_process").spawn;
var path = require("path");
var fs = require("fs");

function Bot(bot_path) {
    bot_path = path.resolve(bot_path);
    //info = localStorage.getItem(bot_path);
    // console.log(bot_path);
    this.bot_path = bot_path;
    //this.name = info.name;
    //this.created_time = info.created_time;
}

function bot_destructor() {
    try {this.child.kill("SIGKILL");} catch (e) {}
    try {fs.close(this.fd_in);} catch (e) {}
    try {fs.close(this.fd_out);} catch (e) {}
}

function _save() {
    localStorage.setItem(this.bot_path, {
        "name": this.name,
        "created_time": this.created_time
    })
}

function _run(input, timelimit, callback) {
    var bot_path = this.bot_path;
    var bot_dir = path.dirname(this.bot_path);
    var input_file = path.join(bot_dir, "input.txt");
    var output_file = path.join(bot_dir, "output_23323333.txt");
    var output_txt = path.join(bot_dir, "output.txt");
    var card = 0, rule_card = 0;
    
    try { fs.unlinkSync(input_file);} catch (e) {}
    try { fs.unlinkSync(output_file);} catch (e) {}
    try { fs.unlinkSync(output_txt);} catch (e) {}
    try {
        fs.writeFileSync(input_file, input);
    } catch (e) {
        console.log(e);
    }
    
    //console.log("bot_dir = " + bot_dir);
    try {
        var fd_in = fs.openSync(input_file, "r");
        var fd_out = fs.openSync(output_file, "w");
        var child = spawn(bot_path, {stdio: [fd_in, fd_out, fd_out], cwd: bot_dir});
        var closed = false;
        if(!child){
            callback(0,0,0);
        }
        this.child = child;
        this.fd_in = fd_in;
        this.fd_out = fd_out;
    } catch (e) {
        console.log(e);
        callback(e, card, rule_card);
    }

    var watcher = setTimeout(function () {
        if (closed) return;
        closed = true;
        child.kill("SIGKILL");
    }, timelimit);

    child.on("error", (e) => {
        console.log(e);
    });
    child.on("close", (code) => {
        if(code === null){
            code = 0;
        }
        clearTimeout(watcher);
        closed = true;

        var parse_output = function (file) {
            try {
                //console.log(file);
                var data = fs.readFileSync(file, "utf-8");
                //console.log(data);
                var a = data.split("\n")[0].split(" ").map(x => parseInt(x));
                return [a[0], a[1]]
            } catch (e) {
                // console.log(e)
                return [0, 0];
            }
        }

        var a = parse_output(output_file);
        
        if ((a[0] > 0 && a[0] <=77 )|| (a[1] > 0 && a[1]<=77)) [rule_card, card] = a;
        else {
            //console.log('lalala');
            [rule_card, card] = parse_output(output_txt);
            // console.log([rule_card, card])
        }


        try {fs.closeSync(fd_in);} catch (e) {console.log(e);}
        try {fs.closeSync(fd_out);} catch (e) {console.log(e);}
        try { fs.unlinkSync(input_file);} catch (e) {console.log(e);}
        try { fs.unlinkSync(output_file);} catch (e) {}
        try { fs.unlinkSync(output_txt);} catch (e) {}
        
        //console.log('debug code:' + code);
        callback(code, card, rule_card)
    });
}

Bot.prototype = {
    constructor: Bot,
    destructor: bot_destructor,
    run: _run,
    save: _save
}

module.exports = Bot;
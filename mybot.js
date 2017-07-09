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

function _clean() {
    try {fs.closeSync(this.fd_in);} catch (e) {}
    try {fs.closeSync(this.fd_out);} catch (e) {}
    try {fs.unlinkSync(this.input_file);} catch (e) {}
    try {fs.unlinkSync(this.output_file);} catch (e) {}
    try {fs.unlinkSync(this.output_txt);} catch (e) {}
}

function _run(input, timelimit, callback) {
    var bot_path = this.bot_path;
    var bot_dir = path.dirname(this.bot_path);
    this.input_file = path.join(bot_dir, "input.txt");
    this.output_file = path.join(bot_dir, "output_23323333.txt");
    this.output_txt = path.join(bot_dir, "output.txt");
    var card = 0, rule_card = 0;

    this.clean();
    try {
        fs.writeFileSync(this.input_file, input);
    } catch (e) {
        console.log(e);
    }
    
    //console.log("bot_dir = " + bot_dir);
    try {
        this.fd_in = fs.openSync(this.input_file, "r");
        this.fd_out = fs.openSync(this.output_file, "w");
        this.child = spawn(bot_path, {stdio: [this.fd_in, this.fd_out, this.fd_out], cwd: bot_dir});
        var closed = false;
        if(!this.child){
            this.clean(true);
            callback(0,0,0);
            return;
        }
    } catch (e) {
        console.log(e);
        this.clean(true);
        callback(e, card, rule_card);
        return;
    }

    var watcher = setTimeout(function () {
        if (closed) return;
        closed = true;
        this.child.kill("SIGKILL");
    }, timelimit);

    this.child.on("error", (e) => {
        console.log(e);
    });
    this.child.on("close", (code) => {
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

        var a = parse_output(this.output_file);
        
        if ((a[0] > 0 && a[0] <=77 )|| (a[1] > 0 && a[1]<=77)) [rule_card, card] = a;
        else {
            //console.log('lalala');
            [rule_card, card] = parse_output(this.output_txt);
            // console.log([rule_card, card])
        }

        this.clean(true);
        //console.log('debug code:' + code);
        callback(code, card, rule_card)
    });
}

Bot.prototype = {
    constructor: Bot,
    //destructor: bot_destructor,
    run: _run,
    save: _save,
    clean: _clean
}

module.exports = Bot;
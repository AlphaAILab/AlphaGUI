'use strict'

function getUrlVar(key){
	var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search); 
	return result && unescape(result[1]) || ""; 
}

function testurl(key){
    var ret = getUrlVar(key);
    if(ret === "") return false;
    else return true;
}

var Bot = require('./mybot.js');
var callback;
var _x;
var now_page=1;
var botlist=[];
var per_page = 5;
var select_bot = -1;
var snackbar_time = 3000;

function getNow(){
    var  _date = new Date();
    return _date.getTime();
}

/*
<div class="row-content">
      <div class="least-content">15m</div>
      <h4 class="list-group-item-heading">Tile with a label</h4>

      <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus.</p>
    </div>
  </div>
  <div class="list-group-separator"></div>
*/
function bot2html(bots){
    var s='';
    for(var bot of bots){
        console.log(escape(bot.bot_path))
        s+=`<div class="list-group-item" style="cursor:pointer;" id="bot${bot.botid}" onclick="javascript:click_bot(${bot.botid});">`
        s+=`<div class="row-content">`;
        s+=`<div class="least-content">${bot.created_time}</div>`
        s+=`<h4 class="list-group-item-heading">${bot.name}</h4>`
        s+=`<p class="list-group-item-text"><nobr>path: ${bot.bot_path}</nobr><br/>${bot.win}/${bot.play_num}</p></div></div>`
        s+=`<div class="list-group-separator"></div>`
    }

    return s;
}
function save_botlist(){
    for(var x in botlist){
        botlist[x].botid=x;
    }
    localStorage.setItem('botlist',JSON.stringify(botlist));
}

function click_save_ai(){

    var ai_name = $('#inputName').val();
    var ai_path = '';
    if(!/^[0-9a-zA-Z_]{3,12}$/.test(ai_name)){
        var options =  {
            content: "Name error! /^[0-9a-zA-Z_]{3,12}$/", 
            style: "toast", 
            timeout: snackbar_time
        }
        $.snackbar(options);
        return;
    }
    try{
        ai_path = $('#inputPath').get(0).files[0].path;
    }catch(e){
        var options =  {
            content: "Path error!", 
            style: "toast", 
            timeout: snackbar_time 
        }
        $.snackbar(options);
        return;
    }
    
    
    console.log(ai_name);
    console.log(ai_path);

    var bot = new Bot(ai_path);
    bot.created_time = getNow();
    bot.name = ai_name;
    bot.win = 0;
    bot.play_num =0;
    $.snackbar({
        content: "Testing AI...",
        style: "toast",
        timeout: snackbar_time
    })
    // bot.test
    // call back ok and below

    // bot.save
    $.snackbar({
        content: "Saving AI...",
        style: "toast",
        timeout: snackbar_time
    })
    // call back saved and below

    botlist.splice(0,0,bot);
    save_botlist();
    now_page = 1;
    render_init();
    select_bot = 0;
    render_right(bot);

}
function clear_right(){
    $('#group1').hide();
    $('#group2').hide();
    $('#group3').hide();
    $('#btns').html('');
    $('#title').text('Select or ADD an AI');
}
function click_add_ai(){
    $('#inputName').val('')
    $('#title').text('ADD an AI');
    $('#group1').show();
    $('#group2').show();
    $('#group3').hide();
    $('#btns').html('<button type="reset" class="btn btn-default" >Reset</button>\
    <button type="button" class="btn btn-primary" onclick="javascript:click_save_ai();">Save</button>')
}

function page2html(now_page){
    var s='';
    var left_class = "";
    if(now_page === 1) left_class = "disabled";
    var right_class = "";
    var max_page = parseInt((botlist.length-1)/per_page)+1;
    if(now_page >= max_page) right_class = "disabled";
    var start = Math.max(1,now_page - 2);
    var end = Math.min(max_page,now_page+2);
    s+=`<li class="${left_class}"><a href="javascript:click_page(${now_page-1});">«</a></li>`
    for(var i = start ; i<= end ;i++){
        var class_ = '';
        if(i === now_page){
            class_ = "active";
        }
        s+=`<li class="${class_}"><a href="javascript:click_page(${i})">${i}</a></li>`
    }
    s+=`<li class="${right_class}"><a href="javascript:click_page(${now_page+1})">»</a></li>`
    return s;
}
function click_page(page_num){
    now_page = page_num;
    $('#showbot').html(bot2html(botlist.slice((now_page-1)*per_page,now_page*per_page)));
    $('#page').html(page2html(now_page));
}
function click_delete_ai(){
    botlist.splice(select_bot,1);
    save_botlist();
    $.snackbar({
        content: "Deleted.",
        style: "toast",
        timeout:snackbar_time
    })
    select_bot = -1;
    clear_right();
    render_init();
}
function render_right(bot){
    $('#title').text('AI Info')
    $('#inputName').val(bot.name);
    $('#pathinfo').val(bot.bot_path);
    $('#group1').show();
    $('#group2').hide();
    $('#group3').show();
    $('#btns').html('<button type="button" class="btn btn-danger" onclick="javascript:click_delete_ai();">DELETE THIS AI</button>')

}
function click_bot(bot){
    $('#bot'+select_bot).removeClass('select');
    select_bot = bot;
    $('#bot'+select_bot).addClass('select');
    
    console.log('click bot '+bot);
    render_right(botlist[bot]);
}

function render_init(){
    select_bot = -1;
    $('#showbot').html(bot2html(botlist.slice((now_page-1)*per_page,now_page*per_page)));
    $('#page').html(page2html(now_page));
}

function start(){// 渲染botlist
    $('#group1').hide();
    $('#group2').hide();
    $('#group3').hide();
    var list = ''
    try{list = JSON.parse(localStorage.getItem('botlist'));} catch(e){
        console.log('bbb');
        list = [];
        localStorage.setItem('botlist',JSON.stringify(list));
    }
    console.log(list);
    if(!list || typeof(list) !== 'object'){
        console.log('aaa')
        list = [];
        localStorage.setItem('botlist',JSON.stringify(list));
    }
    botlist = list;
    for(var x in botlist){
        botlist[x].botid = x;
    }

    /*debug */
    // for(var i =0 ;i< 53 ;i++){
    //     var bot = new Bot(`./bottrivial${i}`);
    //     bot.created_time = getNow();
    //     bot.name = `botname${i}`;
    //     botlist.push(bot);
    //     bot.win = i;
    //     bot.play_num = i+10;
    //     bot.botid=i;
    // }

    render_init();


}

function click_battle(){
    if(select_bot === -1){
        alert('Please select an AI!');
        return;
    }
    callback[_x+'type'] = 'ai';
    callback[_x+'_is_ai'] = 'aaa';
    callback[_x+'_ai_id'] = select_bot;

    location.href = './matching.html?'+$.param(callback);
}

function receive(){
    if(testurl('url')){
        $('#battle').show();
        callback = {
            myid:getUrlVar('myid')
        }
        _x = getUrlVar('select');
        if(testurl('A_is_ai')){
            callback.Atype = 'ai';
            callback.A_is_ai = 'aaa';
            callback.A_ai_id = getUrlVar('A_ai_id');
        }
        if(testurl('A_is_human')){
            callback.Atype = 'human';
            callback.A_is_human = 'aaa';
        }
        if(testurl('B_is_ai')){
            callback.Btype = 'ai';
            callback.B_is_ai = 'aaa';
            callback.B_ai_id = getUrlVar('B_ai_id');

        }
        if(testurl('B_is_remote')){
            // remote info
            callback.Btype = 'remote';
            callback.B_is_remote = 'aaa';

        }
        // 上面是发来的information
        
        // change back button
        $('#back').removeAttr('onclick');
        $('#back').attr('href','./matching.html?'+$.param(callback));
    }
}

$(receive);
$(start)
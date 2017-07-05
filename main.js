const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

var io = require("socket.io-client");
var s = io("http://bj02.lcybox.com:23333");
const ipcMain = electron.ipcMain;

var uuid = null;
var username = "a";
var status_save = "online";
var op_save = null;
var online_users = [];
var game_id = "sbl";
var sender = null;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

ipcMain.on("match", function (e, toname) {
  s.emit("match", toname);
  sender = e.sender;
});

s.on("matched", function (op, _game_id) {
  gmae_id = _game_id;
  console.log("jump to matching.html");
  //
  //
});

s.on("start", function (_game_id, op_config) {
  if (game_id !== _game_id) return;
  console.log("jump to arena.html");
  //
  //
});

ipcMain.on("invite", function (e, toname) {
  s.emit("forward", toname, "invite", username);
  sender = e.sender;
});

ipcMain.on("get_online_users", function (e) {
  console.log("ipcMain.on get_online_users");
  sender = e.sender;
  sender.send("online_users", online_users);
  s.emit("get_online_users");
});

s.on("online_users", function (users) {
  online_users = users;
});

s.on("disconnect", function () {
  online_users = [];
});

ipcMain.on("sign_up", function (e, uuid_, username_) {
  sender = e.sender;
  username = username_;
  uuid = uuid_;
  console.log(uuid_ + " " + username_);
  s.emit("sign_up", uuid, username);
  s.emit("get_online_users");
});

s.on("name_be_used", function (username_) {
  sender.send("name_be_used", username_);
});
s.on("signup_success", function (username_) {
  console.log("signup_success: " + username_);
  sender.send("signup_success", username_);
});
s.on("opponet_disconnected", function (opponet) {
  console.log("opponet_disconnected: " + opponet);
  sender.send("opponet_disconnected", opponet);
  s.emit("get_online_users");
});

s.on("reconnect", function () {
  if (typeof (uuid) === "string" && uuid.length > 5 && typeof(username) === "string" && username.length > 2) {
      s.emit("update_status", uuid, status_save, op_save);
  }
});

ipcMain.on("update_status", function (e, status, op) {
  sender = e.sender;
  if (op === undefined) op = null;
  status_save = status;
  op_save = op;
  s.emit("update_status", uuid, status, op);
  s.emit("get_online_users");
});

ipcMain.on("forward", function (e, toname, cmd, args) {
  console.log("forward out");
  sender = e.sender;
  s.emit("forward", toname, cmd, args);
});

var registered = {};
var buffer = {};

function s_call(cmd) {
    args = buffer[cmd];
    registered[cmd] = undefined;
    buffer[cmd] = undefined;
    sender.send(cmd, args);
}

ipcMain.on("register", function (e, cmd) {
  console.log("register: " + cmd);
  sender = e.sender;
    registered[cmd] = true;
    if (buffer[cmd] !== undefined) {
        s_call(cmd);
    }
});

ipcMain.on("debug", function (e, msg) {
  var x = new Date();
  console.log(x.getTime() + msg);
});

s.on("forward", function (cmd, args) {
  console.log("forward: " + cmd + " " + args);
  buffer[cmd] = args;
  if (registered[cmd] !== undefined) {
      s_call(cmd);
  }
});




function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'home.html'),
    protocol: 'file:',
    slashes: true
  }))
/*
  // open testpage
  const modalPath = path.join('file://', __dirname, 'testpage.html')
  let win = new BrowserWindow({ width: 800, height: 600 });
  win.on('close', function () { win = null });
  win.loadURL(modalPath);
  //win.webContents.openDevTools()
  win.show()
  mainWindow.focus()
// end open test page
*/

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

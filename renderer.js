// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')

const newWindowBtn = document.getElementById('openzrt')

newWindowBtn.addEventListener('click', function (event) {
  let win = new BrowserWindow({ width: 400, height: 320 });
  win.on('close', function () { win = null });
  win.loadURL("https://zrt.io");
  win.show()
})
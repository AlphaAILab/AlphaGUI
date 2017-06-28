// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')

const newWindowBtn = document.getElementById('testpage')

newWindowBtn.addEventListener('click', function (event) {
  const modalPath = path.join('file://', __dirname, 'testpage.html')
  let win = new BrowserWindow({ width: 700, height: 500 });
  win.on('close', function () { win = null });
  win.loadURL(modalPath);
  //win.webContents.openDevTools()
  win.show()
})

'use strict'
// <script src="./static/js/rasterizeHTML.allinone.js"></script>


const electron = require('electron')
const desktopCapturer = electron.desktopCapturer
const electronScreen = electron.screen
const shell = electron.shell

const fs = require('fs')
const os = require('os')
const path = require('path')

const screenshotMsg = document.getElementById('screenshot-path')
var _screenshotPath = '';
function getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);

      var dataURL = canvas.toDataURL("image/png");
      return dataURL

    // return dataURL.replace("data:image/png;base64,", "");
}

function do_report(a,b,c){
    // todo
    //console.log(a,b,c);
    

}


function getscreen() {
  const thumbSize = determineScreenShotSize()
  let options = { types: ['screen'], thumbnailSize: thumbSize }

  desktopCapturer.getSources(options, function (error, sources) {
    if (error) return console.log(error)

    sources.forEach(function (source) {
      if (source.name === 'Entire screen' || source.name === 'Screen 1') {
        const screenshotPath = path.join(os.tmpdir(), 'screenshot.png')

        fs.writeFile(screenshotPath, source.thumbnail.toPng(), function (error) {
          if (error) return console.log(error)
          console.log(screenshotPath);
          _screenshotPath = screenshotPath;
          $.confirm({
            title: 'Bug Report',
            content: ''+
            '<form class="form-horizontal">'+
            '<input id = "buguser" type="text" class="form-control" placeholder="Your Name">'+
            '<textarea id="bugdetail" class="form-control" >Bug Detail: </textarea><br/>'+
            `<img id="canvas" src="file://${screenshotPath}">`+
            '</form>',
            buttons:{
                formSubmit:{
                    text: 'Submit',
                    btnClass : 'btn btn-success',
                    action: function(){
                        do_report($('#buguser').val(),$('#bugdetail').val(),getBase64Image($('#canvas').get(0)))
                    }
                },
                cancel:function(){
                    //close
                }
            }
        });
        })
      }
    })
  })
}

function determineScreenShotSize () {
  const screenSize = electronScreen.getPrimaryDisplay().workAreaSize
  const maxDimension = Math.max(screenSize.width, screenSize.height)
  return {
    width: maxDimension * window.devicePixelRatio,
    height: maxDimension * window.devicePixelRatio
  }
}

function bug(){
    
    getscreen();

}


function start(){
    
}
$(start);

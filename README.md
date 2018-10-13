# electron
notes and experimentation with electron -- following Electron in Action by Steve Kinney (2018, Manning Publications)

* Electron is a software framework for the development of desktop GUI combining node.js and chromium.

* Cross-origin requests are permitted in electron as it has all the abilities of a node server and Chromium experimental broswer features. This also means that browser compatabillity is not a problem as a published electron app includes the chromium files. 

## Setting up a ui window and loading html

```javascript
const { app, BrowserWindow } = require('electron')

let mainWindow = null

app.on('ready', () => {
  console.log('we online')
  mainWindow = new BrowserWindow()
  mainWindow.webContents.loadFile('./app/index.html')
})
```

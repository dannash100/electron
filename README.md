# electron
notes and experimentation with electron -- following Electron in Action by Steve Kinney (2018, Manning Publications)

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

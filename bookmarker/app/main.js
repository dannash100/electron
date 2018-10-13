const { app, BrowserWindow } = require('electron')

let mainWindow = null

app.on('ready', () => {
  console.log('we online')
  mainWindow = new BrowserWindow()
})
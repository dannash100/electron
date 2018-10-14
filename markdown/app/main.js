const {
  app,
  BrowserWindow,
  dialog
} = require('electron')

const fs = require('fs')

const windows = new Set()

const createWindow = exports.createWindow = () => {
  let newWindow = newBrowserWindow({ show: false })
  newWindow.loadFile('./app/index.html')
  newWindow.once('ready-to-show', () => {
    newWindow.show()
  })
  newWindow.on('closed', () => {
    windows.delete(newWindow)
    newWindow = null
  })
  windows.add(newWindow)
  return newWindow
}

app.on('ready', () => {
  createWindow()
})

const getFileFromUser = exports.getFileFromUser = (targetWindow) => {
  const files = dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {name: 'Text Files', extensions: ['txt']},
      {name: 'Markdown Files', extensions: ['md', 'markdown']}
    ]
  })
  if (files) { openFile(targetWindow, files[0]) }
}

const openFile = exports.openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString()
  targetWindow.webContents.send('file-opened', file, content)
}
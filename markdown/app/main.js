const {
  app,
  BrowserWindow,
  dialog
} = require('electron')

const fs = require('fs')

const windows = new Set()

const createWindow = exports.createWindow = () => {
  let x, y
  const currentWindow = BrowserWindow.getFocusedWindow()
  if (currentWindow) {
    const [currentWindowX, currentWindowY] = currentWindow.getPosition()
    x = currentWindowX + 10
    y = currentWindowY + 10
  }
  let newWindow = new BrowserWindow({ x, y, show: false })
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

app.on('will-finish-launching', () => {
  app.on('open-file', (event, file) => {
    const win = createWindow()
    win.once('ready-to-show', () => {
      openFile(win, file)
    })
  })
})

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    return false
  }
  app.quit()
})

app.on('activate', (event, hasVisibleWindows) => {
  if(!hasVisibleWindows) createWindow()
})

const getFileFromUser = exports.getFileFromUser = (targetWindow) => {
  const files = dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {name: 'Markdown Files', extensions: ['md', 'mdown', 'mkdn', 'mkd', 'text', 'markdown']}
    ]
  })
  if (files)  openFile(targetWindow, files[0]) 
}

const openFile = exports.openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString()
  app.addRecentDocument(file)
  targetWindow.setRepresentedFilename(file)
  targetWindow.webContents.send('file-opened', file, content)
}

const saveHtml = exports.saveHtml = (targetWindow, content) => {
  const file = dialog.showSaveDialog(targetWindow, {
    title: 'Save HTML',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'HTML Files', extensions: ['html']}
    ]
  })
  if (!file) return
  fs.writeFileSync(file, content)
}

const saveMarkdown = exports.saveMarkdown = (targetWindow, file, content) => {
  if (!file) {
    file = dialog.showSaveDialog(targetWindow, {
      title: 'Save Markdown',
      defaultPath: app.getPath('documents'),
      filters: [
        { name: 'Markdown Files', extensions: ['md', 'mdown', 'mkdn', 'mkd', 'text', 'markdown']}
      ]
    })
  }
  if (!file) return

  fs.writeFileSync(file, content)
  openFile(targetWindow, file)
}
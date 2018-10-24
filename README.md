# electron #
### a selection of simple projects to explore desktop UI with HTML and Node.js. 
------------------------------------------------------------------------------
*notes taken while following Electron in Action by Steve Kinney (2018, Manning Publications)*

* Electron is a software framework for the development of desktop GUI combining node.js and chromium.

* Cross-platform: macOS, Windows and Linux

* Cross-origin requests are permitted in electron as it has all the abilities of a node server and Chromium experimental broswer features. This also means that browser compatabillity is not a problem as a published electron app includes the chromium files. 

### Set-up: multiple UI windows with offset and MacOS dock support

```javascript
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

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    return false
  }
  app.quit()
})

app.on('activate', (event, hasVisibleWindows) => {
  if(!hasVisibleWindows) createWindow()
})
```
* to reference which window is in use : ```currentWindow = remote.getCurrentWindow()```
* options for app.on lifecycle events include
  - ```'will-finish-launching'``` fires after 'ready'
  - ```'open-file'``` fires when a file is opened.



### Example of opening a file

```javascript
// called from onClick inside renderers
const getFileFromUser = exports.getFileFromUser = (targetWindow) => {
  const files = dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {name: 'Markdown Files', extensions: ['md', 'mdown', 'mkdn', 'mkd', 'text', 'markdown']}
    ]
  })
  if (files)  openFile(targetWindow, files[0]) 
}
// main process
const openFile = exports.openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString()
  app.addRecentDocument(file) // appends file to recent documents
  targetWindow.setRepresentedFilename(file) // macOS only
  targetWindow.webContents.send('file-opened', file, content)
}
```

* To make use of the 'recently opened' functionality:
```javascript
app.on('will-finish-launching', () => {
  app.on('open-file', (event, file) => {
    const win = createWindow()
    win.once('ready-to-show', () => {
      openFile(win, file)
    })
  })
})

```

### Saving files
* use saveDialog to select path of the file. 
```javascript
file = dialog.showSaveDialog(targetWindow, {
  title: 'Save Markdown',
  defaultPath: app.getPath('documents'),
  filters: [
   { name: 'Markdown Files', extensions: ['md', 'mdown', 'mkdn', 'mkd', 'text', 'markdown']}
  ]
}
fs.writeFileSync(file, content)
```

### Shell module 
```javascript
const { shell } = require('electron')
```
* Provides functions related to high-level desktop integration

  - shell.openExternal(URL): find the users prefered browser and open URL

### Dev tools 
* Electron apps have access to Chrome Developer Tools using **Command-Option-I**
* mainWindow object can programmaticly open devtools with ```webContents.openDevTools()```
* set up a build task in Visual Studio Code and a tasks.json in project folder - **Command-Shift-B** to start application with debugging.

package.json
```json
"group": {
    "kind": "build",
    "isDefault": true
 }
```
launch.json
```json
{
    "version": "0.2.0",
    "configurations": [
      {
        "name": "Debug Main Process",
        "type": "node",
        "request": "launch",
        "cwd": "${workspaceRoot}",
        "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron",
        "windows": {
          "runtimeExecutable": "${workspaceRoot}/node_modules/.bin/electron.cmd"
        },
        "args" : ["."]
      }
    ]
  }
```

### Dialog module
* Access to native file dialog boxes, optional first argument of ```mainWindow``` object appears as dropdown from app window rather than an additional window. 
```javascript
dialog.showOpenDialog(mainWindow, {
    properties: ['openfile'],
    filters: [
       { name: 'Text Files', extensions: ['txt'] },
       { name: 'Markdown Files', extensions: ['md', 'markdown'] }
    ]
})
 ```
* openfile dialog is attached to the parent window, making it modal. The filters specifies an array of file types that can be displayed or selected when you want to limit the user to a specific type. 
* returns an array containing consisting of paths of selected file/files. 
* property flags include ```["openDirectory"]``` and ```["multiselections"]```

### BrowserWindow module
* ```getFocusedWindow()``` reference to active window, will return undefined if nothing is active. 
* ```getPosition() => [x, y]``` 
* ```setTitle()``` change windows title
* ```setDocumentEdited()``` subtle window change for MacOS

### Interprocess Communication with Remote Module
* built in require function does not work across electron processes, instead use the Remote Module to communicate between your multiple renderers and the main process. 
* anonymous functions assigned to a variable can be exported in this way as exports is an object in which you can attach properties and methods to
```javascript
const doSomething = exports.doSomething = () => {
}
```
* to require with remote module use ```remote.require('./main.js')```
* in main process use ```mainWindow.webContents.send('channelName', ...dataToSend )``` to broadcast data on chosen channel
* in renderers use ```ipcRenderer.on('channelName' (event, (dataToReceive) => {})``` to set up listeners on channel specified above.

### Menus
* Electron enables custom application and context menus
* ```application-menu.js``` build a template object and export ```Menu.buildFromTemplate(template)```
* in main.js ready method call ```Menu.setApplicationMenu(applicationMenu)```
* template example inside Markdown section of the project showing hotkeys, seperators and submenus.
* right-click context menu's can be overwritten and replaced with custom menus. 

#### Context Menu ####
```javascript
markdownView.addEventListener('contextmenu', (event) => {
  event.preventDefault()
  createContextMenu().popup({})
})

const createContextMenu = () => {
  return Menu.buildFromTemplate([
    { label: 'Open File', click() { mainProcess.getFileFromUser() } },
    {
      label: 'Show File in Folder',
      click: showFile,
      enabled: !!filePath 
    },
    {
      label: 'Open in Default Editor',
      click: openInDefaultApplication,
      enabled: !!filePath
    },
    { type: 'separator' },
    { label: 'Cut', role: 'cut'},
    { label: 'Copy', role: 'copy'},
    { label: 'Paste', role: 'paste'},
    { label: 'Select All', role: 'selectall'}
  ])
} 
```

### Menu bar/ Tray Applications
* See clipmaster for example of Menu bar applications and clipmaster2 for a more detailed project

### Configuring Babel for use with electron-compile
* at the time of writing, electron supports features up to ES2015 out-of-the-box, 
* electron-compile will look for a file named ```.compilerc```.
* example configuration to be found in jetsetter project.

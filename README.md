# electron #
### a selection of simple projects to explore desktop UI with HTML and Node.js. 
------------------------------------------------------------------------------
*notes taken while following Electron in Action by Steve Kinney (2018, Manning Publications)*

* Electron is a software framework for the development of desktop GUI combining node.js and chromium.

* Cross-platform: macOS, Windows and Linux

* Cross-origin requests are permitted in electron as it has all the abilities of a node server and Chromium experimental broswer features. This also means that browser compatabillity is not a problem as a published electron app includes the chromium files. 

### Set-up: UI window and loading html.

```javascript
const windows = new Set()

const createWindow = exports.createWindow = () => {
  let newWindow = new BrowserWindow({ show: false })
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
```
* to reference which window is in use : ```currentWindow = remote.getCurrentWindow()```


### Shell module 
```javascript
const { shell } = require('electron')
```
* Provides functions related to high-level desktop integration

  - shell.openExternal(URL): find the users prefered browser and open URL

### Dev Tools 
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

### Dialog Module
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



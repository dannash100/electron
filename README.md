# electron #
### a selection of simple projects to explore desktop UI with HTML and Node.js. 
------------------------------------------------------------------------------
*notes taken while following Electron in Action by Steve Kinney (2018, Manning Publications)*

* Electron is a software framework for the development of desktop GUI combining node.js and chromium.

* Cross-origin requests are permitted in electron as it has all the abilities of a node server and Chromium experimental broswer features. This also means that browser compatabillity is not a problem as a published electron app includes the chromium files. 

### Set-up: UI window and loading html.

```javascript
const { app, BrowserWindow } = require('electron')

let mainWindow = null

app.on('ready', () => {
    mainWindow = new BrowserWindow({show: false})
    mainWindow.loadFile('./app/index.html')
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
    mainWindow.on('closed', () => {
        mainWindow = null
    })
})
```

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
* Access to native file dialog boxes 
```javascript
dialog.showOpenDialog({
    properties: ['openfile']
    filters: [
       { name: 'Text Files, extensions: ['txt'] },
       { name: 'Markdown Files', extensions: ['md', 'markdown']}
    ]
})
 ```
* openfile dialog is attached to the parent window, making it modal. The filters specifies an array of file types that can be displayed or selected when you want to limit the user to a specific type. 
* returns an array containing consisting of paths of selected file/files. 
* property flags include ```["openDirectory"]``` and ```["multiselections"]```

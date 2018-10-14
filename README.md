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

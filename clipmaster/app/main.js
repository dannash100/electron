const path = require('path')
const {
    app,
    clipboard,
    Menu,
    Tray,
    systemPreferences
} = require('electron')

const clippings = []
let tray = null

const getIcon = () => {
    if (process.platform === 'win32') return 'icon-light@2x.ico'
    if (systemPreferences.isDarkMode()) return 'icon-light.png'
    return 'icon-dark.png'
}

app.on('ready', () => {
    if (app.dock) app.dock.hide()

    tray = new Tray(path.join(__dirname, getIcon()))

    if (process.platform === 'win32') {
        tray.on('click', tray.popUpContextMenu)
    }

    updateMenu()

    tray.setToolTip('Clipmaster')
})

const updateMenu = () => {
    const menu = Menu.buildFromTemplate([
        {
            label: 'Create New Clipping',
            click() { addClipping() },
            accelerator: 'CommandOrControl+Shift+C'
        },
        { type: 'separator' },
        ...clippings.map(createClippingMenuItem),
        { type: 'separator' },
        {
            label: 'Quit',
            click() { app.quit() },
            accelerator: 'CommandOrControl+Q'
        }
    ])
    tray.setContextMenu(menu)
}

const addClipping = () => {
  const clipping = clipboard.readText()
  if (clippings.includes(clipping)) return
  clippings.unshift(clipping)
  updateMenu()
  return clipping
}

const createClippingMenuItem = (clipping, index) => {
  return {
    label: clipping.length > 20
    ? clipping.slice(0, 20) + '...'
    : clipping,
    click() { clipboard.writeText(clipping) },
    accelerator: `CommandOrControl+${index}`
  }
}
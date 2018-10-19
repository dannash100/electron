const {app, BroswerWindow, Menu, shell } = require('electron')
const mainProcess = require('./main')

const template = [{
  label: 'Edit',
  submenu: [
    {
      label: 'Copy',
      accelerator: 'CommandOrControl+C',
      role: 'copy'
    },
    {
      label: 'Paste',
      accelerator: 'CommandOrControl+V',
      role: 'paste'
    }
  ]
}]

if (process.platform === 'darwin') {
  const name = 'Markdown Editor'
  template.unshift({ label: name }) // moves new item to beginning of template array for macOS
}

module.exports = Menu.buildFromTemplate(template)
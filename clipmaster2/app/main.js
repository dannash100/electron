const { globalShortcut } = require('electron');
const Menubar = require('menubar');

const menubar = Menubar();

menubar.on('ready', () => {
  const createClipping = globalShortcut.register('CommandOrControl+!', () => {
    menubar.window.webContents.send('create-new-clipping');
  });

  const writeClipping = globalShortcut.register('CommandOrControl+!', () => {
    menubar.window.webContents.send('write-to-clipboard');
  });

  const publishClipping = globalShortcut.register('CommandOrControl+!', () => {
    menubar.window.webContents.send('publish-clipping');
  });

  if (!createClipping) {
    console.error('Registration failed', 'createClipping');
  }

  if (!writeClipping) {
    console.error('Registration failed', 'writeClipping');
  }

  if (!publishClipping) {
    console.error('Registration failed', 'publishClipping');
  }
});

menubar.on('after-create-window', () => {
  menubar.window.loadURL(`file://${__dirname}/index.html`);
});

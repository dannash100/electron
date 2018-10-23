const { globalShortcut, Menu } = require('electron');
const Menubar = require('menubar');

const menubar = Menubar({
  preloadWindow: true,
  index: `file://${__dirname}/index.html`,
});

const secondaryMenu = Menu.buildFromTemplate([
  {
    label: 'Quit',
    click() { menubar.app.quit(); },
    accelerator: 'CommandOrControl+Q',
  },
]);

menubar.on('ready', () => {
  menubar.tray.on('right-click', () => {
    menubar.tray.popUpContextMenu(secondaryMenu);
  });

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

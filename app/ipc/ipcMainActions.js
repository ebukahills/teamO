import { ipcMain, BrowserWindow } from 'electron';

import { startServer } from '../server/serverSetup';

let callWindow = null;

export function start() {
  const mainWindow = BrowserWindow.getAllWindows()[0];

  ipcMain.on('set:team', (e, team) => {
    startServer(team);
  });

  // New Call, New Window Handler
  ipcMain.on('new:call', (e, { call, stream }) => {
    console.log('Call Mediastream: \n', call, 'My Stream: \n', stream);
    let { id } = call;
    let { type } = call.metadata;

    if (!callWindow) {
      // Call Window not created yet. Create it
      callWindow = new BrowserWindow({
        // show: false,
        parent: mainWindow, // Set the main window as parent
        backgroundColor: '#000',
        // alwaysOnTop: true,
        skipTaskbar: true,
        acceptFirstMouse: true,
        autoHideMenuBar: true,
        hasShadow: true,
        devTools: process.env.NODE_ENV === 'production' ? false : true,
        height: type === 'video' ? 200 : 600,
        width: 600,
        titleBarStyle: 'hidden',
      });

      callWindow.loadURL(`file://${__dirname}/../call.html`);

      callWindow.webContents.on('did-finish-load', () => {
        if (!callWindow) {
          throw new Error('Call Window was not found!');
          return;
        }
        callWindow.show();
        startCall();
      });

      callWindow.on('closed', () => {
        callWindow = null;
      });
    } else {
      startCall();
    }

    function startCall() {
      // Listen for events from call window
      ipcMain.once(`call:end:${id}`, () => {
        mainWindow.webContents.send(`call:end:${id}`);
      });
      // Send Call Objects to call window
      callWindow.webContents.send('call:start', { call, stream, id });
    }
  });
}

export function stop() {}

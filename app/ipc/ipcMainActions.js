import { ipcMain, BrowserWindow } from 'electron';

import { startServer } from '../server/serverSetup';

export function start() {
  ipcMain.on('set:team', (e, team) => {
    startServer(team);
  });
}

export function stop() {}

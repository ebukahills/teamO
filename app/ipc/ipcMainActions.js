import { ipcMain, BrowserWindow } from 'electron';

import {
  initSwarm,
  listenSwarm,
  startSwarm,
  onNewConnection,
  OnEvent,
  getPeerCount,
  closeSwarm
} from '../swarm';

import {startDB} from '../db'

export function start() {
  let { webContents } = BrowserWindow.getAllWindows()[0];

  ipcMain.on('set:team', async (e, team) => {
    console.log('Team Joined: ', team);
    if (initSwarm(team)) {
      // Initiate and Start syncing database here
      await startSwarm()
      startDB(team);
    } else {
      webContents.send('msg:error', {
        message: 'Error Connecting to Team.',
        info: 'Please Restart App',
      });
    }
  });

  return true;
}

export function stop() {
  closeSwarm()
  ipcMain.removeAllListeners();
  return true;
}

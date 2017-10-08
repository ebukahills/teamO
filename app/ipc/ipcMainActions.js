import { ipcMain, BrowserWindow } from 'electron';

import {
  initSwarm,
  listenSwarm,
  startSwarm,
  onNewConnection,
  OnEvent,
  getPeerCount,
  closeSwarm,
} from '../swarm';

import { startDB, login, register } from '../db';

export function start() {
  let { webContents } = BrowserWindow.getAllWindows()[0];

  ipcMain.on('auth:login', async (e, { username, password, team }) => {
    console.log('Joining Team: ', team);
    if (initSwarm(team, username)) {
      // Login: Starts DB and Syncing
      login(team, username, password);
    } else {
      webContents.send('msg:error', {
        error: 'Error Connecting to Team.',
        message: 'Please Restart App',
      });
    }
  });

  ipcMain.on('auth:register', async (e, { name, username, password, team }) => {
    if (initSwarm(team, username)) {
      register(name, username, password, team);
    } else {
      webContents.send('msg:error', {
        error: 'Error Connecting to Team.',
        message: 'Please Restart App',
      });
    }
  });

  return true;
}

export function stop() {
  closeSwarm();
  ipcMain.removeAllListeners();
  return true;
}

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
    // Login: Starts DB and Syncing
    login(team, username, password);
  });

  ipcMain.on('auth:register', async (e, { name, username, password, team }) => {
    register(name, username, password, team);
  });

  return true;
}

export function stop() {
  closeSwarm();
  ipcMain.removeAllListeners();
  return true;
}

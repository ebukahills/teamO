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

import { startDB, login, register, getAllUsers } from '../db';

export function start() {
  ipcMain.on('auth:login', (e, { username, password, team }) => {
    console.log('Joining Team: ', team);
    // Login: Starts DB and Syncing
    login(team, username, password);
  });

  ipcMain.on('auth:register', (e, { name, username, password, team }) => {
    register(name, username, password, team);
  });

  setInterval(() => {
    getAllUsers();
  }, 5000);

  return true;
}

export function stop() {
  closeSwarm();
  ipcMain.removeAllListeners();
  return true;
}

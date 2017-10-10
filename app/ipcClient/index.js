import { ipcRenderer } from 'electron';

import { store } from '../';

import { loadUsers } from '../actions/appActions';

export function start() {
  ipcRenderer.on('data:users', (e, users) => {
    store.dispatch(loadUsers(users));
  });
}

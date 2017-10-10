// @flow

export const APP_READY = 'APP_READY';

export const appReady = (bool: boolean) => {
  return {
    type: APP_READY,
    ready: bool,
  };
};

export const LOAD_USERS = 'LOAD_USERS';

export const loadUsers = (users: []) => {
  return {
    type: LOAD_USERS,
    users,
  };
};

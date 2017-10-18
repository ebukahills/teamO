// @flow

export const APP_READY = 'APP_READY';

export const appReady = (bool: boolean) => {
  return {
    type: APP_READY,
    ready: bool || true,
  };
};

export const LOAD_USERS = 'LOAD_USERS';

export const loadUsers = (users: []) => {
  return {
    type: LOAD_USERS,
    users,
  };
};

export const ACTIVE_CHAT = 'ACTIVE_CHAT';

export const setActive = (active: string) => {
  return {
    type: ACTIVE_CHAT,
    active,
  };
};

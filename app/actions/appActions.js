// @flow

export const APP_READY = 'APP_READY';

export const appReady = (bool: boolean) => {
  return {
    type: APP_READY,
    ready: bool,
  };
};

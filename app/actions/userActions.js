import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';

import { showError } from './feedbackActions';

import { startClient } from '../client/clientSetup';

export const SET_TEAM = 'SET_TEAM';
export const LOGIN = 'LOGIN';

export const setTeam = (team, fromRehydrate) => {
  return dispatch => {
    ipcRenderer.send('set:team', team.trim().toUpperCase());
    dispatch({
      type: SET_TEAM,
      team,
    });
    if (!fromRehydrate) {
      // No need to redirect to Login if Action came from Redux Rehydration
      dispatch(push('/login'));
    }
  };
};

export const startLogin = (username, password, team) => {
  return dispatch => {
    // Listen once for the auth:login event from Main
    ipcRenderer.once('auth:login', (e, data) => {
      console.log(data);
      if (data.authenticated) {
        dispatch(login(username, data.details));
      } else {
        dispatch(showError(data.error));
      }
    });
    // Send the auth:login event to Main
    ipcRenderer.send('auth:login', { team, username, password });
  };
};

export const login = (username, fromRehydrate, details) => dispatch => {
  startClient(username);
  dispatch({
    type: LOGIN,
    username,
    details,
  });
  if (!fromRehydrate) {
    dispatch(push('/'));
  }
};

export const startRegister = (name, username, password, team) => dispatch => {
  ipcRenderer.once('auth:register', (e, data) => {
    console.log('Registration Data: ', data);
    if (data.authenticated) {
      dispatch(login(username, data.details));
    } else {
      dispatch(showError(data.error));
    }
  });
  // Send auth:register to Main
  ipcRenderer.send('auth:register', { team, name, username, password });
};

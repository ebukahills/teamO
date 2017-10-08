import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';

import { showError } from './feedbackActions';

export const SET_TEAM = 'SET_TEAM';
export const LOGIN = 'LOGIN';

export const setTeam = team => {
  return dispatch => {
    // ipcRenderer.send('set:team', team.trim().toUpperCase());
    dispatch(push('/login'));
    dispatch({
      type: SET_TEAM,
      team,
    });
  };
};

export const startLogin = (username, password, team) => {
  return dispatch => {
    // Listen once for the auth:login event from Main
    ipcRenderer.once('auth:login', (e, data) => {
      console.log(data);
      if (data.authenticated) {
        dispatch(login(username, data.details));
        dispatch(push('/'));
      } else {
        dispatch(showError(data.error));
      }
    });
    // Send the auth:login event to Main
    ipcRenderer.send('auth:login', { team, username, password });
  };
};

export const login = (username, details) => {
  return {
    type: LOGIN,
    username,
    details,
  };
};

export const startRegister = (name, username, password, team) => dispatch => {
  ipcRenderer.once('auth:register', (e, data) => {
    console.log('Registration Data: ', data);
    if (data.authenticated) {
      dispatch(login(username, data.details));
      dispatch(push('/'));
    } else {
      dispatch(showError(data.error));
    }
  });
  // Send auth:register to Main
  ipcRenderer.send('auth:register', { team, name, username, password });
};

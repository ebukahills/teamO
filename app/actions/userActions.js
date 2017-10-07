import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';

import {showError} from './feedbackActions'

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

export const startLogin = (username, password) => {
  return (dispatch, getState) => {
    const { team } = getState().user;
    // Listen once for the auth:login event from Main
    ipcRenderer.once('auth:login', data => {
      if (data.authenticated) {
        dispatch(login(username, data.details));
        dispatch(push('/'))
      } else {
        dispatch(
          showError('Error Logging In to Team. Wrong Username or Password')
        );
      }
    });
    // Send the auth:login event to Main
    ipcRenderer.send('auth:login', { username, password, team });
  };
};

export const login = (username, details) => {
  return {
    type: LOGIN,
    username,
    details,
  }
}
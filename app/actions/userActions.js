import { ipcRenderer } from 'electron';
import { push } from 'react-router-redux';

export const SET_TEAM = 'SET_TEAM';

export const setTeam = team => {
  return dispatch => {
    ipcRenderer.send('set:team', team.trim().toUpperCase());
    dispatch(push('/login'));
    dispatch({
      type: SET_TEAM,
      team,
    });
  };
};

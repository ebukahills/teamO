import { SET_TEAM, LOGIN } from '../actions/userActions';

const initUser = {
  team: '',
  username: '',
  authenticated: false,
  details: {},
};

export default (state = initUser, action) => {
  // User Reducer
  switch (action.type) {
    case SET_TEAM:
      return {
        ...state,
        team: action.team,
      };

    case LOGIN:
      return {
        ...state,
        authenticated: true,
        username: action.username,
        details: action.details ? action.details : state.details,
      };

    default:
      return state;
  }
};

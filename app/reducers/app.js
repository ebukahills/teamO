import { APP_READY, LOAD_USERS } from '../actions/appActions';

const initApp = {
  ready: false,
  users: [],
};

export default (state = initApp, action) => {
  switch (action.type) {
    case APP_READY:
      return {
        ...state,
        ready: true,
      };

    case LOAD_USERS:
      return {
        ...state,
        users: action.users,
      };

    default:
      return state;
  }
};

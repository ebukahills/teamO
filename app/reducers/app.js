import { APP_READY, LOAD_USERS, ACTIVE_CHAT } from '../actions/appActions';

const initApp = {
  ready: false,
  users: [],
  active: '',
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

    case ACTIVE_CHAT:
      return {
        ...state,
        active: action.active,
      };

    default:
      return state;
  }
};

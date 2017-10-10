import { APP_READY } from '../actions/appActions';

const initApp = {
  ready: false,
};

export default (state = initApp, action) => {
  switch (action.type) {
    case APP_READY:
      return {
        ...state,
        ready: true,
      };

    default:
      return state;
  }
};

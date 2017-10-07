// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import user from './user';

const rootReducer = combineReducers({
  router,
  user,
});

export default rootReducer;

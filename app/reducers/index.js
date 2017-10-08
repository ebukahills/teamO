// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import user from './user';
import feedback from './feedback'

const rootReducer = combineReducers({
  router,
  user,
  feedback,
});

export default rootReducer;

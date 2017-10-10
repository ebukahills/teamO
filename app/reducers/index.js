// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import user from './user';
import feedback from './feedback';
import app from './app';

const rootReducer = combineReducers({
  app,
  router,
  user,
  feedback,
});

export default rootReducer;

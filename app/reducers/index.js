// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import user from './user';
import feedback from './feedback';
import app from './app';
import messages from './messages';

const rootReducer = combineReducers({
  app,
  router,
  user,
  messages,
  feedback,
});

export default rootReducer;

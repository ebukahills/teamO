import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import rootReducer from '../reducers';

const history = createBrowserHistory();
const router = routerMiddleware(history);
const enhancer = compose(applyMiddleware(thunk, router), autoRehydrate());

function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  return store;
}

export default { configureStore, history };

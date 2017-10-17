import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { persistStore } from 'redux-persist';
import { ConnectedRouter } from 'react-router-redux';

import { ipcRenderer } from 'electron';

import { configureStore, history } from './store/configureStore';

import Root from './containers/Root';

import { appReady } from './actions/appActions';
import { setTeam, login } from './actions/userActions';
// import 'bootstrap/dist/css/bootstrap.css'; Bootstrap is imported in app.global.css
import './app.global.css';
import './app.global.scss';

export const store = configureStore();

// Persist Store with Redux Persist
persistStore(store, {}, err => {
  if (err) {
    throw new Error(err);
  } else {
    store.dispatch(appReady(true));
    // Get User information from restored state and startLogin action to Main
    const { username, team } = store.getState().user;
    if (team) {
      store.dispatch(setTeam(team));
    }
    if (username) {
      store.dispatch(login(username));
    }
  }
});

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}

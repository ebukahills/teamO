/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import App from './containers/App';
import MainPage from './containers/MainPage';
import EnterTeam from './containers/EnterTeam';
import Login from './containers/Login';
import Register from './containers/Register';

export default ({ history }) => (
  <ConnectedRouter history={history}>
    <App>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/team" component={EnterTeam} />
        <Route path="/*" component={MainPage} />
        <Redirect from="*" to="/" />
      </Switch>
    </App>
  </ConnectedRouter>
);

/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import App from './containers/App';

import MainPage from './containers/MainPage';
import EnterTeam from './containers/EnterTeam';
import Login from './containers/Login';
import Register from './containers/Register';

export default () => (
  <App>
    <Switch>
      <Route path="/" exact={true} component={MainPage} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/team" component={EnterTeam} />
      <Redirect from="*" to="/" />
    </Switch>
  </App>
);

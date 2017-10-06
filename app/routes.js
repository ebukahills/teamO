/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import App from './containers/App';

import MainPage from './containers/MainPage';
import EnterTeam from './containers/EnterTeam';

export default () => (
  <App>
    <Switch>
      <Route path='/main' component={MainPage} />
      <Route path='/team' component={EnterTeam} />
      <Redirect from='*' to='/team' />
    </Switch>
  </App>
);

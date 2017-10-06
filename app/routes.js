/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import App from './containers/App';

import Main from './containers/Main';
import EnterTeam from './containers/EnterTeam';

export default () => (
  <App>
    <Switch>
      <Route path='/main' component={Main} />
      <Route path='/team' component={EnterTeam} />
      <Redirect from='*' to='/team' />
    </Switch>
  </App>
);

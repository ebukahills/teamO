/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import App from './containers/App';
import MainPage from './containers/MainPage';
import EnterTeam from './containers/EnterTeam';
import Login from './containers/Login';
import Register from './containers/Register';

import Loading from './components/Loading';

export default connect(state => {
  // mapStateToProps
  return {
    ready: state.app.ready,
  };
})(props => {
  // Functional Root Component
  return props.ready ? (
    <App>
      <Switch>
        <Route path="/" exact={true} component={MainPage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/team" component={EnterTeam} />
        <Redirect from="*" to="/" />
      </Switch>
    </App>
  ) : (
    <Loading />
  );
});

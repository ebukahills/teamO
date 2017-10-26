import React, { Component } from 'react';
import { connect } from 'react-redux';

import Sidebar from './Sidebar';
import ChatPage from './ChatPage';

import { setActive } from '../actions/appActions';
import { redirect } from '../actions/routerActions';
import { Switch, Route, Redirect } from 'react-router';

class MainPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { authenticated, username, path, active } = this.props;
    if (!authenticated) {
      this.props.dispatch(redirect('/team'));
    }
    if (path === '/') {
      // Active and Redirect are 2 separate Actions.
      // May change in future
      // this.props.dispatch(setActive(username));
      // this.props.dispatch(redirect(`/chat/${active || username}`));
    }
  }

  render() {
    let { username } = this.props;
    return (
      <div id="slack-container">
        <Sidebar />
        <Switch>
          <Route path="/chat/*" component={ChatPage} />
          <Redirect from="/" exact to={`/chat/${username}`} />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.user.authenticated,
    username: state.user.username,
    path: state.router.location.pathname,
    active: state.app.active,
  };
}

export default connect(mapStateToProps)(MainPage);

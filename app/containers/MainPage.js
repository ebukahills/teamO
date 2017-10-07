import React, { Component } from 'react';

import Sidebar from './Sidebar';
import ChatPage from './ChatPage';

import {redirect}  from '../actions/routerActions'
import { connect } from 'react-redux';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    if(!this.props.authenticated) {
      this.props.dispatch(redirect('/team'));
    }
  }

  render() {
    return (
      <div id="slack-container">
        <Sidebar />
        <ChatPage />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.user.authenticated
  }
}

export default connect(mapStateToProps)(MainPage)
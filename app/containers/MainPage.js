import React, { Component } from 'react';

import Sidebar from './Sidebar';
import ChatPage from './ChatPage';

import { redirect } from '../actions/routerActions';

class MainPage extends Component {
  constructor(props) {
    super(props);
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
  return {};
}

export default MainPage;

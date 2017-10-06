import React, { Component } from 'react';

import Sidebar from './Sidebar';
import ChatPage from './ChatPage';

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

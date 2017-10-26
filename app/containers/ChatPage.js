import React, { Component } from 'react';
import { connect } from 'react-redux';

import Message from '../components/Message';
import MessageInput from '../components/MessageInput';

import { sendMessage } from '../client/clientSetup';

class ChatPage extends Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount() {
  // }

  componentDidUpdate() {
    document.getElementById('scrollIntoView').scrollIntoView();
  }

  onSendMessage(m) {
    let { username, active } = this.props;
    let message = {
      message: m, // String function was called with from MessageInput Child;
      from: username,
      to: active,
      time: Date.now(),
    };
    sendMessage(message);
  }

  render() {
    // let scrollIntoView = document.getElementById('scrollIntoView');
    // if (scrollIntoView) {
    //   setTimeout(function() {
    //     scrollIntoView.scrollIntoView();
    //   }, 1000);
    // }
    let { messages, username = 'tester', active = 'tester' } = this.props;
    console.log(messages, active);
    // Active is the Active Chat Route
    return (
      <div id="chat">
        <div className="header-bar">
          <h1>@{active}</h1>
          <div className="details">
            <h3 className="members">5 members</h3>
            <h3 className="purpose">Sometimes we do cool stuff</h3>
          </div>
        </div>
        <div id="chatbox">
          <ul className="messages">
            {messages.length ? (
              messages.map((message, key) => (
                <Message
                  key={key}
                  message={message}
                  me={message.from === username}
                />
              ))
            ) : (
              <span />
            )}
            <li id="scrollIntoView" />
          </ul>
        </div>
        <MessageInput
          onSubmit={message => this.onSendMessage(message)}
          active={active}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.messages[state.app.active] || [], // Messages Array
    username: state.user.username || 'tester',
    active: state.app.active || 'tester',
  };
}

export default connect(mapStateToProps)(ChatPage);

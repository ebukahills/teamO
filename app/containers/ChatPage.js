import React, { Component } from 'react';
import { connect } from 'react-redux';

import Message from '../components/Message';

class ChatPage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { messages, username, active } = this.props;
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
            {messages &&
              messages.map((message, key) => {
                <Message
                  key={key}
                  message={message}
                  me={message.from === username}
                />;
              })}
          </ul>
        </div>
        <div className="input-bar">
          <form>
            <input type="text" placeholder={`Send to @${active}`} />
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let active = state.app.active;
  return {
    messages: state.messages[active], // Messages Array
    username: state.user.username,
    active,
  };
}

export default connect(mapStateToProps)(ChatPage);

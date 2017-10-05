import React, { Component } from 'react';

class ChatPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="chat">
        <div className="header-bar">
          <h1>#general</h1>
          <div className="details">
            <h3 className="members">5 members</h3>
            <h3 className="purpose">Sometimes we do cool stuff</h3>
          </div>
        </div>
        <div id="chatbox">
          <ul className="messages">
            <li className="message">
              <div className="user-icon">
                <img src="http://socialmediaweek.org/wp-content/blogs.dir/1/files/slack-pattern-940x492.jpg" />
              </div>
              <div className="body">
                <div className="username">kimberlygo</div>
                <div className="text">
                  @channel hey guys, update the slides pls
                </div>
              </div>
            </li>
            <li className="message">
              <div className="user-icon">
                <img src="http://socialmediaweek.org/wp-content/blogs.dir/1/files/slack-pattern-940x492.jpg" />
              </div>
              <div className="body">
                <div className="username">navin</div>
                <div className="text">@kimberlygo: okay, i'll do it! </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="input-bar">
          <form>
            <input type="text" placeholder="" />
          </form>
        </div>
      </div>
    );
  }
}

export default ChatPage;

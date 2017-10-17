import React, { Component } from 'react';
import { connect } from 'react-redux';

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { team, username, users } = this.props;
    return (
      <div id="sidebar">
        <div id="sidebar-container">
          <div id="team-name">
            <h1>{team}</h1>
          </div>
          <div id="username">
            <div className="status"> </div>
            <h2>{username}</h2>
          </div>
          <ul id="channels">
            <h4>channels</h4>
            <li className="channel selected">
              <p>
                <i># </i>general
              </p>
            </li>
            <li className="channel unread">
              <p>
                <i># </i>marketing
              </p>
            </li>
            <li className="channel">
              <p>
                <i># </i>tech
              </p>
            </li>
            <li className="channel">
              <p>
                <i># </i>branding
              </p>
            </li>
            <li className="channel">
              <p>
                <i># </i>exec
              </p>
            </li>
          </ul>
          <ul id="direct-messages">
            <h4>Direct Messages</h4>
            {users.map((user, key) => (
              <li key={key} className="direct-message">
                <div className="status"> </div>
                <p>{user}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    team: state.user.team,
    username: state.user.username,
    users: state.app.users,
  };
}

export default connect(mapStateToProps)(Sidebar);

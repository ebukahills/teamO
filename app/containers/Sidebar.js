import React, { Component } from 'react';
import { connect } from 'react-redux';

import { redirect } from '../actions/routerActions';
import { setActive } from '../actions/appActions';

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  redirectToChat(active) {
    this.props.dispatch(setActive(active));
    this.props.dispatch(redirect(`/chat/${active}`));
  }

  render() {
    const { dispatch, team, username, users, path } = this.props;
    const me = path.includes(username);
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
            <h4>GROUPS</h4>
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
            <h4>Messages</h4>
            {users.map((user, key) => (
              <li
                key={key}
                className={`direct-message ${path.includes(user)
                  ? 'selected'
                  : ''}`}
                onClick={() => this.redirectToChat(user)}
              >
                <div className="status"> </div>
                <p>
                  {user} {me ? '  (Me)' : ''}
                </p>
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
    path: state.router.location.pathname,
  };
}

export default connect(mapStateToProps)(Sidebar);

import React, { Component } from 'react';
import { connect } from 'react-redux';

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { team, username } = this.props;
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
            <li className="direct-message">
              <div className="status"> </div>
              <p>slackbot</p>
            </li>
            <li className="direct-message">
              <div className="status"> </div>
              <p>navin</p>
            </li>
            <li className="direct-message">
              <div className="status"> </div>
              <p>edys</p>
            </li>
            <li className="direct-message">
              <div className="status"> </div>
              <p>kimberlygo</p>
            </li>
            <li className="direct-message">
              <div className="status inactive" />
              <p>alexandra</p>
            </li>
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
  };
}

export default connect(mapStateToProps)(Sidebar);

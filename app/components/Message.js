import React from 'react';
import Time from './Time';

const Message = props => {
  if (props.me) {
    return (
      // Message Sent From Me
      <li className="message d-flex justify-content-end">
        <div className="body">
          <div className="username text-right">
            <Time time={props.message.time} />
            {'    '}
            Me
          </div>
          <div className="text">{props.message.message}</div>
        </div>
        <div className="user-icon">
          <img src="http://socialmediaweek.org/wp-content/blogs.dir/1/files/slack-pattern-940x492.jpg" />
        </div>
      </li>
    );
  } else {
    return (
      // Message Sent From Other client
      <li className="message d-flex">
        <div className="user-icon">
          <img src="http://socialmediaweek.org/wp-content/blogs.dir/1/files/slack-pattern-940x492.jpg" />
        </div>
        <div className="body">
          <div className="username">
            {props.message.from}
            {'    '}
            <Time time={props.message.time} />
          </div>
          <div className="text">{props.message.message}</div>
        </div>
      </li>
    );
  }
};

// Message.prototype = {}

export default Message;

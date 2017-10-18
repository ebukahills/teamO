import React from 'react';

const Message = props => {
  return props.me ? (
    <li className="message d-flex justify-content-end">
      <div className="body">
        <div className="username text-right">Me</div>
        <div className="text">{props.message.message}</div>
      </div>
      <div className="user-icon">
        <img src="http://socialmediaweek.org/wp-content/blogs.dir/1/files/slack-pattern-940x492.jpg" />
      </div>
    </li>
  ) : (
    <li className="message d-flex">
      <div className="user-icon">
        <img src="http://socialmediaweek.org/wp-content/blogs.dir/1/files/slack-pattern-940x492.jpg" />
      </div>
      <div className="body">
        <div className="username">{props.message.from}</div>
        <div className="text">{props.message.message}</div>
      </div>
    </li>
  );
};

// Message.prototype = {}

export default Message;

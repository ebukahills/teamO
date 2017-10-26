import React from 'react';
import TimeAgo from 'react-timeago';

// Message Time component wrapper using TimeAgo
export default props => {
  return (
    <TimeAgo className="timeAgo" date={props.time} live={true} minPeriod={30} />
  );
};

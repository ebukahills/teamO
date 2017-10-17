import { NEW_MESSAGE, SEND_MESSAGE } from '../actions/messageActions';
import { getUsername } from '../client/clientSetup';

/**
 * Messages Object Schema
 * {
 *  username: [
 *    {
 *      message: 'Lorem Ipsum dolor amet',
 *      from: username || me
 *      time: Date.now(),
 *    }
 *  ]
 * }
*/

const sortByTime = (a, b) => a.time - b.time; // Message Sorting function

export default (state = {}, action) => {
  var message;
  switch (action.type) {
    case NEW_MESSAGE:
      message = action.message;
      // If Message from Me, set msg object key to sender
      let fromTo = message.from === getUsername() ? message.to : message.from;
      // If first message, create Array
      let newMessageArr = state[fromTo]
        ? state[fromTo].concat(message)
        : [].concat(message);
      return {
        ...state,
        [state[fromTo]]: newMessageArr.sort(sortByTime, 0),
      };

    default:
      return state;
  }
};

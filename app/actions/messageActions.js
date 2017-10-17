export const NEW_MESSAGE = 'NEW_MESSAGE';
export const SEND_MESSAGE = 'SEND_MESSAGE';

export const newMessage = message => dispatch => {
  return dispatch({
    type: NEW_MESSAGE,
    message,
  });
};

export const sendMessage = message => dispatch => {
  return dispatch({
    type: SEND_MESSAGE,
    message,
  });
};

export const SHOW_ERROR = 'SHOW_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export const showError = error => dispatch => {
  console.log(JSON.stringify(error));
  const id = Date.now();
  dispatch({
    type: SHOW_ERROR,
    id,
    error,
  });
  setTimeout(function() {
    dispatch(clearError(id));
  }, 10000);
};

export const clearError = id => {
  return {
    type: CLEAR_ERROR,
    id,
  };
};

export const SHOW_INFO = 'SHOW_INFO';
export const CLEAR_INFO = 'CLEAR_INFO';

export const showInfo = info => dispatch => {
  console.log(info);
  let id = Date.now();
  dispatch({
    type: SHOW_INFO,
    id,
    info,
  });
  setTimeout(function() {
    dispatch(clearInfo(id));
  }, 10000);
};

export const clearInfo = id => {
  return {
    type: CLEAR_INFO,
    id,
  };
};

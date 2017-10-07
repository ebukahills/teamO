export const SHOW_ERROR = 'SHOW_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export const showError = error => dispatch => {
  const id = Date.now();
  dispatch({
    type: SHOW_ERROR,
    id,
    error,
  })
  setTimeout(function() {
    dispatch(clearError(id));
  }, 10000);
}

export const clearError = id => {
  return {
    type: CLEAR_ERROR,
    id
  }
}
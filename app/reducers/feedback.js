import {
  SHOW_ERROR,
  CLEAR_ERROR,
  SHOW_INFO,
  CLEAR_INFO,
} from '../actions/feedbackActions';

const initFeedback = {
  errors: [],
  info: [],
};

export default (state = initFeedback, action) => {
  switch (action.type) {
    case SHOW_ERROR:
      return {
        ...state,
        errors: state.errors.concat({
          id: action.id,
          error: action.error,
        }),
      };

    case CLEAR_ERROR:
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.id),
      };

    case SHOW_INFO:
      return {
        ...state,
        info: state.info.concat({
          id: action.id,
          info: action.info,
        }),
      };

    case CLEAR_ERROR:
      return {
        ...state,
        info: state.info.filter(info => info.id !== action.id),
      };

    default:
      return state;
  }
};

import {SET_TEAM} from '../actions/userActions'

const initUser = {
  team: '',
  username: '',
  authenticated: false,
  details: {}
}

export const userReducer = (state = initUser, action) {
  switch (action.type) {
    case SET_TEAM:
      return {
        ...state,
        team: action.team
      }
  
    default:
      return state;
  }
}
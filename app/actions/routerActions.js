import {push} from 'react-router-redux';

export const redirect = route => dispatch => dispatch(push(route));
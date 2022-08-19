import { SET_ORGS, UPDATE_ORGS } from '@jumbo/constants/ActionTypes';

const INIT_STATE = [];

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_ORGS: {
      console.log("action paylod",action.payload)
      return action.payload;
     
    }

    case UPDATE_ORGS: {
      console.log("action paylod update",action.payload)
      return action.payload;
    }

    default:
      return state;
  }
};

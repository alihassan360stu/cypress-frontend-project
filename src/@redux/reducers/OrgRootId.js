import { UPDATE_SELECTED_ORG } from '@jumbo/constants/ActionTypes';

const INIT_STATE = null;

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_ORG: {
      console.log("id ",action.payload);
      return action.payload;
    }

    default:
      return state;
  }
};

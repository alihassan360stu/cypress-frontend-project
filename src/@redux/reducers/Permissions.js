import { SET_PERMISSIONS } from '@jumbo/constants/ActionTypes';

const INIT_STATE = {
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_PERMISSIONS: {
      return { ...action.payload };
    }

    default:
      return state;
  }
};

import { SET_PERMISSIONS } from '@jumbo/constants/ActionTypes';

export const setPermissions = permissions => {
  return dispatch => {
    dispatch({
      type: SET_PERMISSIONS,
      payload: permissions,
    });
  };
};

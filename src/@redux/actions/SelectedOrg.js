import { UPDATE_SELECTED_ORG } from '@jumbo/constants/ActionTypes';

export const setSelectedOrg = org => {
  return dispatch => {
    dispatch({
      type: UPDATE_SELECTED_ORG,
      payload: org,
    });
  };
};


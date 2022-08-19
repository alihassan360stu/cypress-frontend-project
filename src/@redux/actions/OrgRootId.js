import { UPDATE_SELECTED_ORG } from '@jumbo/constants/ActionTypes';

const OrgRootId = org => {
  return dispatch => {
    dispatch({
      type: UPDATE_SELECTED_ORG,
      payload: org,
    });
  };
};

export default OrgRootId;
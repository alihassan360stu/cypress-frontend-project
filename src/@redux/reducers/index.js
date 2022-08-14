import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import Common from './Common';
import Auth from './Auth';
import Permissions from './Permissions';
import Organizations from './Organizations';
import SelectedOrg from './SelectedOrg';

export default history =>
  combineReducers({
    router: connectRouter(history),
    common: Common,
    auth: Auth,
    permissions: Permissions,
    orgs: Organizations,
    org: SelectedOrg,
  });

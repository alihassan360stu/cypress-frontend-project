import { fetchError, fetchStart, fetchSuccess } from '@redux/actions';
import { setAuthUser, updateLoadUser } from '@redux/actions/Auth';
import axios from 'axios';

import moment from 'moment';
var CryptoJS = require('crypto-js');
const MKV = 'L#2Qe2vQNs$)Rdl*Cd(!';
// const availableRoles = ['Admin', 'Association', 'Shopkeeper', 'Company', 'Hotel']
const availableRoles = [
  'Administrator'
];
const baseUrls = { Administrator: 'admin' };

const BasicAuth = {
  onLogin: (data) => {
    return async dispatch => {
      try {
        dispatch(fetchStart());
        var user = await loginRequest(data);
        user.issue_date = moment()
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(user), MKV).toString();
        localStorage.setItem('cypress_user_1001', ciphertext);
        dispatch(setAuthUser(user));
        dispatch(fetchSuccess());
      } catch (error) {
        dispatch(fetchSuccess());
        dispatch(fetchError(error.message ? error.message : error));
      }
    };
  },
  onRegister: (data) => {
    return async dispatch => {
      try {
        dispatch(fetchStart());
        var user = await signupRequest(data);
        user.issue_date = moment()
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(user), MKV).toString();
        localStorage.setItem('cypress_user_1001', ciphertext);
        dispatch(setAuthUser(user));
        dispatch(fetchSuccess());
      } catch (error) {
        dispatch(fetchSuccess());
        dispatch(fetchError(error.message ? error.message : error));
      }
    }
  },
  onLogout: () => {
    return dispatch => {
      dispatch(fetchStart());

      setTimeout(() => {
        localStorage.removeItem('cypress_user_1001');
        dispatch(setAuthUser(null));
        dispatch(fetchSuccess());
        window.location.reload();
      }, 300);
    };
  },

  getAuthUser: (loaded = false) => {
    var iTem = localStorage.getItem('cypress_user_1001');
    var bytes = iTem ? CryptoJS.AES.decrypt(iTem, MKV).toString(CryptoJS.enc.Utf8) : null;
    var user = bytes ? JSON.parse(bytes) : null;

    var validate = checkIfUserCanContiune(user);
    if (!validate.isNull) {
      if (validate.isExpired) {
        user = null;
      }
    }

    return dispatch => {
      dispatch(fetchStart());
      dispatch(updateLoadUser(loaded));
      dispatch(setAuthUser(user));
      dispatch(fetchSuccess());
    };
  },
};

function checkIfUserCanContiune(user) {
  var result = { isNull: true, isExpired: false };
  if (user) {
    result.isNull = false;
    var issueDate = moment(user.issue_date);
    var current_date = moment();
    var duration = current_date.diff(issueDate, 'minutes');
    if (duration > 15) result.isExpired = true;
  }
  return result;
}

async function loginRequest(data) {
  return new Promise((resolve, reject) => {
    axios
      .create()
      .post('/auth/login', data)
      .then(ans => {
        ans = ans.data;
        if (ans.status) {
          resolve(ans.data);
        } else {
          reject(ans.message);
        }
      })
      .catch(e => {
        reject(e);
      });
  });
}

async function signupRequest(data) {
  return new Promise((resolve, reject) => {
    axios
      .create()
      .post('/auth/signup', data)
      .then(ans => {
        ans = ans.data;
        console.log(ans)
        if (ans.status) {
          resolve(ans.data);
        } else {
          reject(ans.message);
        }
      })
      .catch(e => {
        reject(e);
      });
  });
}

export default BasicAuth;

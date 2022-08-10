import { fetchError, fetchStart, fetchSuccess } from '@redux/actions';
import { setAuthUser, updateLoadUser } from '@redux/actions/Auth';
import axios from './config';
import { API_URL } from '@services/Contstants';

const JWTAuth = {
  onRegister: ({ name, email, password }) => {
    return dispatch => {
      dispatch(fetchStart());
      axios
        .post('auth/register', {
          email: email,
          password: password,
          name: name,
        })
        .then(({ data }) => {
          if (data.result) {
            localStorage.setItem('token', data.token.access_token);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token.access_token;
            dispatch(fetchSuccess());
            dispatch(JWTAuth.getAuthUser(true, data.token.access_token));
          } else {
            dispatch(fetchError(data.error));
          }
        })
        .catch(function (error) {
          dispatch(fetchError(error.message));
        });
    };
  },

  onLogin: ({ email, password }) => {
    return dispatch => {
      try {
        dispatch(fetchStart());
        axios
          .post('auth/login', {
            email: email,
            password: password,
          })
          .then(({ data }) => {
            if (data.result) {
              localStorage.setItem('token', data.token.access_token);
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token.access_token;
              dispatch(fetchSuccess());
              dispatch(JWTAuth.getAuthUser(true, data.token.access_token));
            } else {
              dispatch(fetchError(data.error));
            }
          })
          .catch(function (error) {
            dispatch(fetchError(error.message));
          });
      } catch (error) {
        dispatch(fetchError(error.message));
      }
    };
  },

  onLogout: () => {
    return dispatch => {
      dispatch(fetchStart());
      axios
        .post('auth/logout')
        .then(({ data }) => {
          if (data.result) {
            dispatch(fetchSuccess());
            localStorage.removeItem('token');
            dispatch(setAuthUser(null));
          } else {
            dispatch(fetchError(data.error));
          }
        })
        .catch(function (error) {
          dispatch(fetchError(error.message));
        });
    };
  },

  getAuthUser: (loaded = false, token) => {
    return dispatch => {
      if (!token) {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      }
      dispatch(fetchStart());
      dispatch(updateLoadUser(loaded));
      axios
        .post('auth/me')
        .then(({ data }) => {
          if (data.result) {
            dispatch(fetchSuccess());
            dispatch(setAuthUser(data.user));
          } else {
            dispatch(updateLoadUser(true));
          }
        })
        .catch(function (error) {
          dispatch(updateLoadUser(true));
        });
    };
  },


  // onForgotPassword: () => {
  //   return dispatch => {
  //     dispatch(fetchStart());

  //     setTimeout(() => {
  //       dispatch(setForgetPassMailSent(true));
  //       dispatch(fetchSuccess());
  //     }, 300);
  //   };
  // },
  // getSocialMediaIcons: () => {
  //   return <React.Fragment> </React.Fragment>;
  // },
};

function loginRequest(data) {
  return new Promise((resolve, reject) => {
    axios.post(API_URL + "client/login", data).then(ans => {
      ans = ans.data
      if (ans.status) {
        resolve(ans.data)
      } else {
        reject(ans.message)
      }
    }).catch(e => {
      reject(e)
    })
  })
}
export default JWTAuth;

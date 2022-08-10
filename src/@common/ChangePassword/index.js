import React, { useState } from 'react';
import { Grid, Box, Button, CircularProgress, Backdrop } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import BasicForm from './BasicForm';
import validator from 'validator'
import { AuhMethods } from '@services/auth';
import { CurrentAuthMethod } from '@jumbo/constants/AppConstants';

const MySwal = withReactContent(Swal);

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100vh',
    padding: '2%',
    margin: '0 auto',
    backgroundColor: lighten(theme.palette.background.paper, 0.1),

  },
  titleRoot: {
    marginBottom: 14,
    color: theme.palette.text.primary,
  },
  textFieldRoot: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.common.dark, 0.12),
    }
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  pageTitle: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '6px 4px 6px hsla(0,0%,45.9%,.8)',
  }
}));

const initalState = {
  current_password: '',
  new_password: '',
  re_new_password: '',
  is_loading: false
}

const pattern = /^[^-\s][\w\s-]+/;

const Toast = MySwal.mixin({
  target: '#myTest',
  customClass: {
    container: {
      position: 'absolute',
      zIndex: 999999999,
    }
  },
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  onOpen: toast => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});


const AddCompType = () => {

  const classes = useStyles();
  const [state, setState] = useState(initalState);
  const { authUser } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const handleOnChangeTF = (e) => {
    var { name, value } = e.target;
    e.preventDefault();
    setState(prevState => ({ ...prevState, [name]: value }));
  }

  const showMessage = (icon, text, title) => {
    Toast.fire({
      icon,
      title: text
    });
  }

  const validate = (values) => {
    for (let key in values) {
      let valid = pattern.test(values[key].trim());
      if (!valid) {
        showMessage('error', 'Please Fill Form Properly', 'Error');
        return false;
      }
      const { current_password, new_password, re_new_password } = state;

      if (!validator.isStrongPassword(new_password, {
        minLength: 8, minLowercase: 1,
        minUppercase: 1, minNumbers: 1, minSymbols: 1
      })) {
        showMessage('error', 'New Password Must Include 1 Lower Case, 1 Upper Case, 1 Number And 1 Symbol And Min Length Is 8');
        return false;
      }

      if (!validator.isStrongPassword(re_new_password, {
        minLength: 8, minLowercase: 1,
        minUppercase: 1, minNumbers: 1, minSymbols: 1
      })) {
        showMessage('error', 'New Password Must Include 1 Lower Case, 1 Upper Case, 1 Number And 1 Symbol And Min Length Is 8');
        return false;
      }

      if (new_password !== re_new_password) {
        showMessage('error', 'New Password Did Not Match With Re-Entered Password');
        return false;
      }

    }
    return true;
  }

  const showMessageNew = (icon, text) => {
    MySwal.fire({
      title: 'Information',
      text,
      icon,
      showCancelButton: false,
      confirmButtonText: 'Plaese Continue !',
      cancelButtonText: 'No, cancel !',
      reverseButtons: true,
    }).then(async result => {
      if (result.value) {
        try {
          // submitRequest();
          // alert('here')
          dispatch(AuhMethods[CurrentAuthMethod].onLogout());
        } catch (e) {
          MySwal.fire('Error', e, 'error');
        }
      }
    });
  }
  const submitRequest = (data) => {
    try {
      Axios.post('general/update-password', data).then(result => {
        result = result.data;
        console.log(result)
        if (result.status) {
          setState({ ...initalState });
          showMessageNew('success', 'Password Changed Successfully, Please Re-Login To Continue');
        } else {
          setState(prevState => ({ ...prevState, is_loading: false }));
          showMessage('error', result.message, 'Error');
        }
      }).catch(e => {
        setState(prevState => ({ ...prevState, is_loading: false }));
        showMessage('error', e, 'Error');
      })
    } catch (e) {
      showMessage('error', e, 'Error');
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const { current_password, new_password, re_new_password } = state;

    if (validate({ current_password, new_password, re_new_password })) {
      setState(prevState => ({ ...prevState, is_loading: true }));
      submitRequest({ old_password: current_password, new_password }
      )
    }
  }

  return (
    <PageContainer heading="" id='myTest' >
      <GridContainer>
        <Grid item xs={12}>
          <div>
            <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
              Change Password
            </Box>
          </div>
          <Divider />
          <br />
          <Box className={classes.root} mt={20}>
            <form autoComplete="off" onSubmit={onSubmit}>
              <Box mb={2}>
                <BasicForm state={state} handleOnChangeTF={handleOnChangeTF} />
                <br />
                <br />
                <Divider />

                <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary" disabled={state.is_loading}>
                  Change
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </GridContainer>
      <Backdrop className={classes.backdrop} open={state.is_loading}>
        <CircularProgress color="secondary" />
      </Backdrop>
    </PageContainer>
  );
};

export default AddCompType;

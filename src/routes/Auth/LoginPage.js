import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Typography, TextField, CircularProgress, Backdrop, Button, Box } from '@material-ui/core';
import IntlMessages from '@jumbo/utils/IntlMessages';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { AuhMethods } from '@services/auth';
import { alpha, makeStyles } from '@material-ui/core/styles';
import CmtImage from '@coremat/CmtImage';
import { CurrentAuthMethod } from '@jumbo/constants/AppConstants';
import AuthWrapper from './AuthWrapper';
import GridContainer from '@jumbo/components/GridContainer';
import { fetchError } from '@redux/actions';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const useStyles = makeStyles(theme => ({
  authThumb: {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50%',
      order: 2,
    },
  },
  errorNumber: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    textShadow: '10px 6px 8px hsla(0,0%,45.9%,.8)',
  },
  authContent: {
    padding: 20,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: props => (props.variant === 'default' ? '100%' : '100%'),
      order: 1,
    },
    [theme.breakpoints.up('xl')]: {
      padding: 20,
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  titleRoot: {
    marginBottom: 14,
    color: theme.palette.text.primary,
  },
  textFieldRoot: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.common.dark, 0.12),
    },
  },
  formcontrolLabelRoot: {
    '& .MuiFormControlLabel-label': {
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
      },
    },
  },
}));

//variant = 'default', 'standard'
const SignIn = ({ method = CurrentAuthMethod, variant = 'default', wrapperVariant = 'default' }) => {
  const common = useSelector(({ common }) => common);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { authUser } = useSelector(({ auth }) => auth);
  const location = useLocation();
  const history = useHistory();

  const dispatch = useDispatch();
  const classes = useStyles({ variant });
  const { error, message } = common;
  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchError(''));
      if (error)
        MySwal.fire('Error', error, 'error');
    }, 200);
  }, [dispatch, error, message]);

  const onSubmit = () => {
    dispatch(AuhMethods[method].onLogin({ email, password }));
  };

  if (authUser) {
    var search = window.location.search;
    var params = new URLSearchParams(search);
    var redirectUrl = params.get('action_url');
    if (redirectUrl) {
      history.push(redirectUrl);
    } else {
      history.push('/app/dashboard');
    }
  }

  return (
    <AuthWrapper variant={wrapperVariant}>
      <Box className={classes.authContent}>
        <GridContainer justifyContent="center" alignItems="center">
          <Box mb={10} display='flex' flexDirection={'column'} alignItems='center'>
            <CmtImage src={'/logo.png'} className='login-logo' style={{ height: '100px' }} />
            <Box className={classes.errorNumber} fontSize={{ xs: 20, sm: 20 }}>
              Welcome To
            </Box>
            <Box className={classes.errorNumber} fontSize={{ xs: 30, sm: 30 }}>
              AUTON8
            </Box>
          </Box>
        </GridContainer>
        <Typography component="div" variant="h1" className={classes.titleRoot}>
          Login
        </Typography>
        <form>
          <Box mb={2}>
            <TextField
              label={<IntlMessages id="appModule.email" />}
              fullWidth
              onChange={event => setEmail(event.target.value)}
              defaultValue={email}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              disabled={common.loading}
            />
          </Box>
          <Box mb={2}>
            <TextField
              type="password"
              label={<IntlMessages id="appModule.password" />}
              fullWidth
              onChange={event => setPassword(event.target.value)}
              defaultValue={password}
              margin="normal"
              variant="outlined"
              className={classes.textFieldRoot}
              disabled={common.loading}
            />
          </Box>

          <Box alignItems="center" mt={5} mb={5}>
            <Button fullWidth onClick={onSubmit} variant="contained" color="primary" disabled={common.loading}>
              <IntlMessages id="appModule.signIn" />
            </Button>
          </Box>
        </form>
        <Box alignItems="center" flexDirection={'column'} mt={5} mb={5}>
          <h4>Do Not Have Any Account ? </h4> <Button fullWidth onClick={() => { history.push('/signup'); }} variant="outlined" color="primary" disabled={common.loading}>Signup</Button>
        </Box>
        <Backdrop className={classes.backdrop} open={common.loading}>
          <CircularProgress color="secondary" />
        </Backdrop>
      </Box>
    </AuthWrapper>
  );
};

export default SignIn;

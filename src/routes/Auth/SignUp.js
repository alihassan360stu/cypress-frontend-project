import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import IntlMessages from '@jumbo/utils/IntlMessages';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';
import ContentLoader from '@jumbo/components/ContentLoader';
import { alpha, makeStyles } from '@material-ui/core/styles';
import CmtImage from '@coremat/CmtImage';
import Typography from '@material-ui/core/Typography';
import { CurrentAuthMethod } from '@jumbo/constants/AppConstants';
import AuthWrapper from './AuthWrapper';
import { NavLink } from 'react-router-dom';
import { AuhMethods } from '@services/auth';
import { setSelectedOrg } from '@redux/actions';

const useStyles = makeStyles(theme => ({
  authThumb: {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    [theme.breakpoints.up('md')]: {
      width: '50%',
      order: 2,
    },
  },
  authContent: {
    padding: 30,
    [theme.breakpoints.up('md')]: {
      width: props => (props.variant === 'default' ? '50%' : '100%'),
      order: 1,
    },
    [theme.breakpoints.up('xl')]: {
      padding: 50,
    },
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
  textCapital: {
    textTransform: 'capitalize',
  },
  textAcc: {
    textAlign: 'center',
    '& a': {
      marginLeft: 4,
    },
  },
  alrTextRoot: {
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'right',
    },
  },
}));

const initalState = {
  username: '',
  full_name: '',
  email: '',
  password: ''
}

//variant = 'default', 'standard', 'bgColor'
const SignUp = ({ method = CurrentAuthMethod, variant = 'default', wrapperVariant = 'default' }) => {
  const [state, setState] = useState(initalState)
  const common = useSelector(({ common }) => common);
  const dispatch = useDispatch();
  const classes = useStyles({ variant });
  const { authUser } = useSelector(({ auth }) => auth);
  const orgs = useSelector(({ orgs }) => orgs);
  const org = useSelector(({ org }) => org);
  const history = useHistory();

  if (authUser) {
    var search = window.location.search;
    var params = new URLSearchParams(search);
    var redirectUrl = params.get('action_url');
    if (orgs) {
      if (orgs.length < 1) {
        history.push('/app/orgs');
      } else {
        if(!org) {
          dispatch(setSelectedOrg(orgs[0]));
          localStorage.setItem('cypress_selected_org_1001', JSON.stringify(orgs[0]));
        }
        if (redirectUrl) {
          history.push(redirectUrl);
        } else {
          history.push('/app/dashboard');
        }
      }
    }
  }

  const handleOnChangeTF = (e) => {
    var { name, value } = e.target;
    e.preventDefault();
    setState(prevState => ({ ...prevState, [name]: value }));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const {
      username,
      full_name,
      email,
      password,
    } = state;
    dispatch(AuhMethods[method].onRegister({ username, full_name, email, password }));
  };

  return (
    <AuthWrapper variant={wrapperVariant}>
      <Box className={classes.authContent}>
        <Typography component="div" variant="h4" className={classes.titleRoot}>
          Welcome To,
        </Typography>
        <Box mb={7}>
          <CmtImage src={'/logo_white.png'} style={{ height: '100px' }} />
        </Box>
        <Typography component="div" variant="h1" className={classes.titleRoot}>
          Create an account
        </Typography>
        <form
          onSubmit={onSubmit}
        >
          <Box mb={2}>
            <TextField
              label={'Username'}
              fullWidth
              name='username'
              onChange={handleOnChangeTF}
              value={state.username}
              margin="normal"
              required
              variant="outlined"
              disabled={common.loading}
              className={classes.textFieldRoot}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label={'Full Name'}
              fullWidth
              required
              name='full_name'
              onChange={handleOnChangeTF}
              value={state.full_name}
              margin="normal"
              variant="outlined"
              disabled={common.loading}
              className={classes.textFieldRoot}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label={'Email'}
              fullWidth
              required
              name='email'
              type={'email'}
              onChange={handleOnChangeTF}
              value={state.email}
              margin="normal"
              variant="outlined"
              disabled={common.loading}
              className={classes.textFieldRoot}
            />
          </Box>
          <Box mb={2}>
            <TextField
              type="password"
              label={<IntlMessages id="appModule.password" />}
              fullWidth
              required
              name='password'
              onChange={handleOnChangeTF}
              value={state.password}
              margin="normal"
              variant="outlined"
              disabled={common.loading}
              className={classes.textFieldRoot}
            />
          </Box>

          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ sm: 'center' }}
            justifyContent={{ sm: 'space-between' }}
            mb={3}>
            <Box mb={{ xs: 2, sm: 0 }}>
              <Button
                type='submit'
                disabled={common.loading}
                variant="contained" color="primary">
                <IntlMessages id="appModule.regsiter" />
              </Button>
            </Box>

          </Box>
        </form>

        <Typography className={classes.textAcc}>
          Have an account?
          <NavLink to="/login">Sign In</NavLink>
        </Typography>
        <ContentLoader />

        {/* <Backdrop className={classes.backdrop} open={common.loading}>
          <CircularProgress color="secondary" />
        </Backdrop> */}
      </Box>
    </AuthWrapper>
  );
};

export default SignUp;

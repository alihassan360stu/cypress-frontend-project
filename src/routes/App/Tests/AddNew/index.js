import React, { useEffect, useState } from 'react';
import { Grid, Box, Button, CircularProgress, Backdrop } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import BasicForm from './BasicForm';
import validator from 'validator'

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
  },
  noRoleTitle: {
    color: theme.palette.warning.dark,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '2px 2px 2px hsla(0,10%,85.9%,.8)',
  }
}));

const initalFormState = {
  name: '',
  description: '',
  script: '',
  is_loading: false
}

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


const AddCompany = () => {

  const classes = useStyles();
  const [formState, setFormState] = useState(initalFormState);

  const handleOnChangeTF = (e) => {
    var { name, value } = e.target;
    e.preventDefault();
    setFormState(prevState => ({ ...prevState, [name]: value }));
  }

  const showMessage = (icon, text) => {
    Toast.fire({
      icon,
      title: text
    });
  }

  const validate = () => {
    return true;
  }

  const submitRequest = (data) => {
    try {
      Axios.post('/test', data).then(result => {
        result = result.data;;
        if (result.status) {
          showMessage('success', result.message);
          setTimeout(() => {
            setFormState({ ...initalFormState })
          }, 1000);
        } else {
          showMessage('error', result.message);
          setFormState(prevState => ({ ...prevState, is_loading: false }));
        }
      }).catch(e => {
        setFormState(prevState => ({ ...prevState, is_loading: false }));
        showMessage('error', e);
      })
    } catch (e) {
      showMessage('error', e);
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        let { name, description, script } = formState
        setFormState(prevState => ({ ...prevState, is_loading: true }))

        let dataToSubmit = { name, description, script, kind: 'test' };
        submitRequest(dataToSubmit)
      } catch (e) {
        MySwal.fire('Error', e, 'error');
      }
    }
  }
  return (
    <PageContainer heading="" id='myTest'>
      <GridContainer>
        <Grid item xs={12}>
          <div>
            <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
              Add New Test
            </Box>
          </div>
          <Divider />
          <br />
          <Box className={classes.root} mt={20}>
            <form autoComplete="off" onSubmit={onSubmit}>
              <Box mb={2}>
                <BasicForm state={formState} handleOnChangeTF={handleOnChangeTF} />
                <br />
                <Divider />
                <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary" disabled={formState.is_loading}>
                  Add
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </GridContainer>
      <Backdrop className={classes.backdrop} open={formState.is_loading}>
        <CircularProgress color="secondary" />
      </Backdrop>
    </PageContainer>
  );
};

export default AddCompany;

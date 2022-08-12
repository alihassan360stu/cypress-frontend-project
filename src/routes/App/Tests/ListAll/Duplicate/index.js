import React, { useState } from 'react';
import { Box, Button, CircularProgress, Backdrop, Dialog } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import qs from 'qs';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import BasicForm from './BasicForm';

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


const EditDialog = ({ name, hideDialog, setRefereshData, rowData }) => {
  // dialogState
  const classes = useStyles();
  const [formState, setFormState] = useState({name: 'copy of '+ rowData.name });
  const [editData, setEditData] = useState({ name: rowData.name, description: rowData.description, script: rowData.script })
  const [loading, setLoading] = useState(false);
  const showMessage = (icon, text, title) => {
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
      Axios.post('/test', data).
      then(result => {
        result = result.data;;
        if (result.status) {
          showMessage('success', result.message);
          setTimeout(() => {
            hideDialog(false)
            setRefereshData(true)
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


  const apiEdeted = () => {

    var data = qs.stringify({
      name: editData.name,
      description: editData.description,
      script: editData.description,
      test_id: rowData._id
    });

    var config = {
      method: 'put',
      url: 'http://3.21.230.123:3008/api/test/',
      data: data
    }
    setLoading(true);
    Axios(config)
      .then(function (response) {
        setLoading(false);
        hideDialog(false)
        showMessage('success', response.message);
        setRefereshData(true)
      })
      .catch(function (error) {
        setLoading(false);
        hideDialog(false)
      });

  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        let { description, script } = rowData;
        let name=formState.name;
        
        // setFormState(prevState => ({ ...prevState, is_loading: true }))
        let dataToSubmit = { name, description, script, kind: 'test' };
        submitRequest(dataToSubmit)
      } catch (e) {
        MySwal.fire('Error', e, 'error');
      }
    }
  }

  const handleClose = (e) => {
    e.preventDefault();
    setTimeout(() => {
      hideDialog(false)
    }, 100);
  }
  return (
    <PageContainer heading="" breadcrumbs={[]}>
      <Dialog
        id='myTest'
        fullWidth={true}
        maxWidth={'md'}
        scroll={'body'}
        open={true}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose(event)
          }
        }}
        aria-labelledby="form-dialog-title">
        <CmtCard mt={20}>
          <CmtCardContent >
            <div>
              <Box className={classes.pageTitle} fontSize={{ xs: 15, sm: 15 }}>
                {
                  name === "clone" ? "Create Duplicate Of " + rowData.name : "Editing " + rowData.name
                }

              </Box>
            </div>
            <Divider />

            <form autoComplete="off" onSubmit={onSubmit}>
              <Box mb={2}>
                {
                  name === "clone" ?
                    <BasicForm valuePart={formState.name} placeHolder="Test Name" state={formState}
                     handleOnChangeTF={(a)=>{setFormState({name:a.target.value})}} /> :
                    <>
                      <Backdrop open={loading}>
                        <CircularProgress color="secondary" />
                      </Backdrop>
                      <BasicForm placeHolder="Test Name" valuePart={editData.name} state={formState}
                        handleOnChangeTF={(e) => { setEditData({ name: e.target.value, description: editData.description, scrip: editData.script }) }} />
                      <BasicForm placeHolder="Description" valuePart={editData.description} state={formState}
                        handleOnChangeTF={(e) => { setEditData({ name: editData.name, description: e.target.value, scrip: editData.script }) }} />
                      <BasicForm placeHolder="Script" valuePart={editData.script} state={formState}
                        handleOnChangeTF={(e) => { setEditData({ name: editData.name, description: editData.description, scrip: e.target.value }) }} />
                    </>
                }
                <Divider />
                <br />
                <Divider />

                {
                  name === "clone" ? <>
                    <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary" disabled={formState.is_loading}>
                      Create
                    </Button>
                    <Button style={{ marginTop: 10, marginLeft: 20 }} type='button' variant="contained" color="primary" disabled={formState.is_loading} onClick={handleClose}>
                      Cancel
                    </Button></> :
                    !loading&&
                    <>
                      <Button style={{ marginTop: 10 }} onClick={apiEdeted} variant="contained" color="primary" disabled={formState.is_loading}>
                        Edit
                      </Button>
                      <Button style={{ marginTop: 10, marginLeft: 20 }} type='button' variant="contained" color="primary" disabled={formState.is_loading} onClick={handleClose}>
                        Close
                      </Button></>
                }

              </Box>
            </form>
          </CmtCardContent>
        </CmtCard>
      </Dialog>
      <Backdrop open={loading}>
        <CircularProgress color="secondary" />
      </Backdrop>
    </PageContainer>
  );
};

export default EditDialog;

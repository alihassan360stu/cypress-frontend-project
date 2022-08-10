import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Backdrop, Dialog } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import BasicForm from './BasicForm';
import validator from 'validator';

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
    },
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
}));

const Toast = MySwal.mixin({
  target: '#myTest',
  customClass: {
    container: {
      position: 'absolute',
      zIndex: 999999999,
    },
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

const validationErrors = {
  name: 'Invalid Name',
  father_name: 'Invalid Father Name',
  contact: 'Invalid Contact Number',
  temp_address: 'Invalid Temporary Address',
  perm_address: 'Invalid Permanent Address',
  designation: 'Invalid Employee Designation',
};

const initalState = {
  name: '',
  father_name: '',
  contact: '',
  temp_address: '',
  perm_address: '',
  designation: '',
  emp_code: '',
  emp_type_id: 1,
};

const EditDialog = ({ dialogState, setDialogState }) => {
  // dialogState
  const classes = useStyles();
  const { authUser } = useSelector(({ auth }) => auth);
  const [formState, setFormState] = useState({ ...dialogState });
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(initalState);
  const [dataOriginal, setDataOriginal] = useState(initalState);

  const handleOnChangeTF = e => {
    var { name, value } = e.target;
    e.preventDefault();
    setData(prevState => ({ ...prevState, [name]: value }));
  };

  const checkIfAnyDifference = () => {
    try {
      var isChange = false;
      for (let key in initalState) {
        if (key !== 'emp_type_id') {
          if (!validator.equals(dataOriginal[key].trim(), data[key].trim())) {
            isChange = true;
            break;
          }
        } else {
          if (Number(dataOriginal[key]) !== Number(data[key])) {
            isChange = true;
            break;
          }
        }
      }
      return isChange;
    } catch (e) {
      showMessage('error', e);
    }
  };

  const showMessage = (icon, text, title) => {
    Toast.fire({
      icon,
      title: text,
    });
  };

  const loadData = emp_history_id => {
    try {
      axios
        .post(authUser.api_url + '/emp/get', { emp_history_id })
        .then(ans => {
          setIsLoading(false);
          ans = ans.data;
          if (ans.status) {
            const tData = ans.data[0];
            setData(tData);
            setDataOriginal(tData);
          } else {
            showMessage('error', ans.message);
          }
        })
        .catch(e => {
          setIsLoading(false);
          showMessage('error', e);
        });
    } catch (e) {
      setIsLoading(false);
      showMessage('error', e);
    }
  };

  const handleClose = e => {
    e.preventDefault();
    setTimeout(() => {
      setDialogState(prevState => ({ ...prevState, show: false }));
    }, 100);
  };

  const validateInfo = () => {
    if (checkIfAnyDifference()) {
      var { name, father_name, contact, temp_address, perm_address, designation } = data;
      var values = { name, father_name, contact, temp_address, perm_address, designation };
      for (let key in values) {
        if (validator.isEmpty(values[key].trim())) {
          showMessage('error', validationErrors[key]);
          return false;
        }
      }

      return true;
    } else {
      showMessage('error', 'Nothing To Update');
      return false;
    }
  };

  const prepareData = () => {
    try {
      var updatedFields = [];
      for (let key in initalState) {
        if (key !== 'emp_type_id') {
          if (!validator.equals(dataOriginal[key].trim(), data[key].trim())) {
            updatedFields.push(key);
          }
        } else {
          if (Number(dataOriginal[key]) !== Number(data[key])) {
            updatedFields.push(key);
          }
        }
      }

      var dataToSubmit = { oldData: {}, newData: {} };
      updatedFields.forEach((field, index) => {
        dataToSubmit.oldData[field] = dataOriginal[field];
        dataToSubmit.newData[field] = data[field];
      });

      // updatedFields.map(field => {

      // })
      return dataToSubmit;
    } catch (e) {
      throw e;
    }
  };

  const submitRequest = () => {
    try {
      const dataToSubmitTemp = prepareData();
      const dataToSubmit = {
        new_data: JSON.stringify(dataToSubmitTemp.newData),
        old_data: JSON.stringify(dataToSubmitTemp.oldData),
        emp_history_id: formState.rowId,
      };
      axios
        .post(authUser.api_url + '/emp/edit', dataToSubmit)
        .then(result => {
          result = result.data;
          if (result.status) {
            showMessage('success', result.message, 'Success');
            setTimeout(() => {
              setDialogState(prevState => ({ ...prevState, show: false, refreshData: false }));
            }, 2000);
          } else {
            setIsLoading(false);
            showMessage('error', result.message, 'Error');
          }
        })
        .catch(e => {
          setIsLoading(false);
          showMessage('error', e, 'Error');
        });
    } catch (e) {
      showMessage('error', e, 'Error');
    }
  };

  const onSubmit = e => {
    try {
      e.preventDefault();
      if (validateInfo()) {
        setIsLoading(true);
        submitRequest();
      }
    } catch (error) {
      showMessage('error', error);
    }
  };

  useEffect(() => {
    loadData(formState.rowId);
  }, []);

  return (
    <PageContainer heading="" breadcrumbs={[]}>
      <Dialog
        id="myTest"
        fullWidth={true}
        maxWidth={'md'}
        scroll={'body'}
        open={dialogState.show}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose(event);
          }
        }}
        aria-labelledby="form-dialog-title">
        <CmtCard mt={20}>
          <CmtCardContent>
            <div>
              <Box className={classes.pageTitle} fontSize={{ xs: 15, sm: 15 }}>
                Update Employee
              </Box>
            </div>
            <Divider />

            <form autoComplete="off" onSubmit={onSubmit}>
              <Box mb={2}>
                <BasicForm data={data} isLoading={isLoading} handleOnChangeTF={handleOnChangeTF} />
                <Divider />
                <br />
                <Divider />
                <Button style={{ marginTop: 10 }} type="submit" variant="contained" color="primary" disabled={isLoading}>
                  Request For Update
                </Button>
                <Button
                  style={{ marginTop: 10, marginLeft: 20 }}
                  type="button"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </form>
          </CmtCardContent>
        </CmtCard>
      </Dialog>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="secondary" />
      </Backdrop>
    </PageContainer>
  );
};

export default EditDialog;

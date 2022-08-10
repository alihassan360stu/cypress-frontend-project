import React, { useState } from 'react';
import { Box, Button, CircularProgress, Backdrop, Dialog } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import BasicForm from './BasicForm';
import validator from 'validator'
import PermissionsSelect from './PermissionsSelect'

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


const validationErrors = {
    username: 'Invalid Username',
    full_name: 'Invalid Full Name',
    email: 'Invalid Email',
    cnic: 'Invalid CNIC Number It Should Be 13 Digit Number Without Dashes',
    password: 'Invalid Password, Password Must Contain A Digit A Small And Capital Word An Special Character And ',
    contact: 'Invalid Contact Number',
    role_id: 'Invalid Role Selected'
};

const EditDialog = ({ dialogState, setDialogState }) => {
    // dialogState
    const classes = useStyles();
    const { authUser } = useSelector(({ auth }) => auth);
    const [formState, setFormState] = useState({ ...dialogState.rowData, new_password: '', is_loading: false });

    const handleOnChangeTF = (e) => {
        var { name, value } = e.target;
        e.preventDefault();
        setFormState(prevState => ({ ...prevState, [name]: value }));
    }

    const showMessage = (icon, text, title) => {
        Toast.fire({
            icon,
            title: text
        });
    }

    const validate = () => {
        var { full_name, new_password, contact, role, allowed_devices } = formState

        var values = { full_name, contact }
        for (let key in values) {
            if (validator.isEmpty(values[key])) {
                showMessage('error', validationErrors[key]);
                return false;
            }
        }

        if (role.title === 'Cypress') {
            if (Number(allowed_devices) < 1) {
                showMessage('error', 'Allowed Devices Can Not Be Less Than 1');
                return false;
            }
        }

        if (new_password.length > 0)
            if (!validator.isStrongPassword(new_password, {
                minLength: 8, minLowercase: 1,
                minUppercase: 1, minNumbers: 1, minSymbols: 1
            })) {
                showMessage('error', 'Password Must Include 1 Lower Case, 1 Upper Case, 1 Number And 1 Symbol And Min Length Is 8');
                return false;
            }

        return true;
    }
    const submitRequest = (data) => {
        try {
            Axios.post(authUser.api_url + '/update-user', data).then(result => {
                result = result.data;;
                if (result.status) {
                    showMessage('success', result.message, 'Success');
                    setTimeout(() => {
                        setDialogState(prevState => ({ ...prevState, show: false, refreshData: true }))
                    }, 2000);
                } else {
                    setFormState(prevState => ({ ...prevState, is_loading: false }));
                    showMessage('error', result.message, 'Error');
                }
            }).catch(e => {
                setFormState(prevState => ({ ...prevState, is_loading: false }));
                showMessage('error', e, 'Error');
            })
        } catch (e) {
            showMessage('error', e, 'Error');
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                setFormState(prevState => ({ ...prevState, is_loading: true }))
                let {
                    _id, full_name, new_password, contact, allowed_devices
                } = formState
                const dataToSubmit = {
                    user_id: _id, full_name, new_password, contact, allowed_devices,
                    is_new_password: new_password.trim().length > 0 ? true : false
                };
                submitRequest(dataToSubmit)
            } catch (e) {
                MySwal.fire('Error', e, 'error');
            }
        }
    }

    const handleClose = (e) => {
        e.preventDefault();
        setTimeout(() => {
            setDialogState(prevState => ({ ...prevState, show: false }))
        }, 100);
    }

    return (
        <PageContainer heading="" breadcrumbs={[]}>
            <Dialog
                id='myTest'
                fullWidth={true}
                maxWidth={'md'}
                scroll={'body'}
                open={dialogState.show}
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
                                Update User
                            </Box>
                        </div>
                        <Divider />

                        <form autoComplete="off" onSubmit={onSubmit}>
                            <Box mb={2}>
                                <BasicForm state={formState} handleOnChangeTF={handleOnChangeTF} />
                                <Divider />
                                <br />
                                <Divider />
                                <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary" disabled={formState.is_loading}>
                                    Update
                                </Button>
                                <Button style={{ marginTop: 10, marginLeft: 20 }} type='button' variant="contained" color="primary" disabled={formState.is_loading} onClick={handleClose}>
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    </CmtCardContent>
                </CmtCard>
            </Dialog>
            <Backdrop className={classes.backdrop} open={formState.is_loading}>
                <CircularProgress color="secondary" />
            </Backdrop>
        </PageContainer>
    );
};

export default EditDialog;

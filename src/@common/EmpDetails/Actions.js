import React, { useState } from 'react';
import { Box, Button, Divider, Dialog, TextField, MenuItem, CircularProgress, Backdrop } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
const MySwal = withReactContent(Swal);

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '100vh',
        padding: '2%',
        margin: '0 auto',
        backgroundColor: lighten(theme.palette.background.paper, 0.1),

    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    divider: {
        width: '100%',
        minHeight: 1.2,
    },
    instructions: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    pageTitle: {
        color: theme.palette.text.primary,
        fontWeight: 800,
        lineHeight: 1.5,
        marginBottom: 20,
        // textShadow: '4px 4px 4px hsla(0,0%,45.9%,.8)',
    },
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

const initialState = {
    remarks: '',
    end_reason_id: -1,
}

const Actions = ({ data, reloadData }) => {
    const { authUser } = useSelector(({ auth }) => auth);
    const [showDialog, setShowDialog] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [state, setState] = useState(initialState)
    const [end_reasons, setEnd_reasons] = useState([])


    const showMessage = (icon, text) => {
        Toast.fire({
            icon,
            title: text
        });
    }

    const loadEndReasons = () => {
        return new Promise((resolve, reject) => {
            try {
                Axios.post('/client/getEmpEndReasons').then(ans => {
                    ans = ans.data;
                    if (ans.status) {
                        setEnd_reasons(ans.data)
                        setIsLoading(false)
                        resolve(true)
                    } else {
                        setIsLoading(false)
                        reject(ans.message)
                    }
                }).catch(e => {
                    setIsLoading(false)
                    reject(e)
                })
            } catch (e) {
                setIsLoading(false)
                reject(e)
            }
        })
    }

    const handleCloseDialog = () => {
        setShowDialog(false)
    }

    const handleOpenDialog = () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do You Really Wish You End Employment For " + data.name,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Agreed, Plaese Continue !',
            cancelButtonText: 'No, cancel !',
            reverseButtons: true,
        }).then(async result => {
            if (result.value) {
                try {
                    setShowDialog(true)
                } catch (e) {
                    MySwal.fire('Error', e, 'error');
                }
            }
        });
    }

    const validate = () => {
        const { end_reason_id, remarks } = state;
        if (end_reason_id === -1) {
            showMessage('error', 'Please Select A Reason For End Employment The Continue')
            return false;
        }

        if (remarks.length < 6) {
            showMessage('error', 'Please Enter Remarks Of Atleast 6 Words')
            return false;
        }

        return true;
    }

    const endEmpRequest = () => {
        return new Promise((resolve, reject) => {
            try {
                const { end_reason_id, remarks } = state
                Axios.post(authUser.api_url + '/emp/end', { emp_history_id: data.id, end_reason_id, remarks }).then(ans => {
                    if (ans.data.status) {
                        resolve(ans.data.message);
                    } else {
                        reject(ans.data.message);
                    }
                })
            } catch (e) {
                reject(e)
            }
        })
    }



    const onSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                setIsLoading(true);
                const text = await endEmpRequest();
                setShowDialog(false);
                setIsLoading(false);
                showMessage('success', text)
                setTimeout(() => {
                    reloadData();
                }, 1000);
            } catch (e) {
                setIsLoading(false);
                showMessage('error', e)
            }
        }
    }


    const handleOnEndEmpClick = async (e) => {
        e.preventDefault();
        if (end_reasons.length > 0) {
            handleOpenDialog();
        } else {
            try {
                setIsLoading(true);
                await loadEndReasons();
                handleOpenDialog();
            } catch (e) {
                showMessage('error', e)
            }
        }
    }

    const handleOnChange = (e) => {
        try {
            e.preventDefault();
            var { name, value } = e.target;
            setState(prevState => ({ ...prevState, [name]: value }))
        } catch (error) {
            showMessage('error', error);
        }
    }

    const classes = useStyles();
    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
            <Button variant='contained' color="secondary" onClick={handleOnEndEmpClick}> End Employment </Button>

            <Dialog
                id='myTest'
                fullWidth={true}
                maxWidth={'md'}
                scroll={'body'}
                open={showDialog}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        handleCloseDialog(event)
                    }
                }}

                aria-labelledby="form-dialog-title">
                <CmtCard mt={20}>
                    <CmtCardContent style={{ padding: '10px' }}>
                        <div>
                            <Box className={classes.pageTitle} fontSize={{ xs: 18, sm: 18 }}>
                                End Employement For {data.name}
                            </Box>
                        </div>
                        <Divider />

                        <form autoComplete="off" onSubmit={onSubmit}>

                            <Box mb={2}>
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Select End Reason"
                                    margin='normal'
                                    name='end_reason_id'
                                    fullWidth
                                    value={state.end_reason_id}
                                    onChange={handleOnChange}
                                    variant="outlined" >

                                    <MenuItem key={10002} value={-1}>
                                        Not Selected
                                    </MenuItem>

                                    {
                                        end_reasons.map(role => (
                                            <MenuItem key={role.id} value={role.id}>
                                                {role.title}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>

                                <TextField
                                    type="text"
                                    label={'Remarks'}
                                    fullWidth
                                    name="remarks"
                                    value={state.remarks}
                                    margin="normal"
                                    variant="outlined"
                                    required
                                    className={classes.textFieldRoot}
                                    onChange={handleOnChange}
                                />

                                <Divider />
                                <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="secondary" disabled={isLoading}>
                                    End Employment
                                </Button>
                                <Button style={{ marginTop: 10, marginLeft: 20 }} type='button' variant="contained" color="primary" disabled={isLoading} onClick={handleCloseDialog}>
                                    Cancel
                                </Button>

                                <Backdrop className={classes.backdrop} open={isLoading}>
                                    <CircularProgress color="secondary" />
                                </Backdrop>

                            </Box>
                        </form>
                    </CmtCardContent>
                </CmtCard>
            </Dialog>
        </Box>
    );
};

export default Actions;

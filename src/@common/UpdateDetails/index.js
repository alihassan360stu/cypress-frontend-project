import React, { useState } from 'react';
import { Box, Button, Dialog } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import BasicForm from './BasicForm';
import Axios from 'axios';
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
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

const EditDialog = ({ dialogState, setDialogState }) => {
    // dialogState
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const rowData = { ...dialogState.rowData };
    const { authUser } = useSelector(({ auth }) => auth);

    const showMessage = (icon, text) => {
        Toast.fire({
            icon,
            title: text
        });
    }

    const handleClose = (e) => {
        e.preventDefault();
        setTimeout(() => {
            setDialogState(prevState => ({ ...prevState, show: false }));
        }, 100);
    }

    const handleCancel = (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            Axios.post(authUser.api_url + '/edit/cancel', { request_id: rowData.id }).then(result => {
                result = result.data;
                if (result.status) {
                    showMessage('success', result.message);
                    setTimeout(() => {
                        setDialogState(prevState => ({ ...prevState, show: false, refreshData: true }));
                    }, 2000);
                } else {
                    setIsLoading(false);
                    showMessage('error', result.message);
                }
            }).catch(e => {
                setIsLoading(false);
                showMessage('error', e);
            })
        } catch (error) {
            showMessage('error', error);
        }
    }

    return (
        <PageContainer>
            <Dialog
                id='myTest'
                fullWidth={true}
                maxWidth={'md'}
                scroll={'body'}
                open={dialogState.show}
                onClose={handleClose}
                aria-labelledby="form-dialog-title">
                <CmtCard mt={20}>
                    <CmtCardContent >
                        <div>
                            <Box className={classes.pageTitle} fontSize={{ xs: 15, sm: 15 }}>
                                Update Request Details
                            </Box>
                        </div>
                        <Divider />

                        <Box mb={2}>
                            <BasicForm data={rowData} />
                            <Divider />
                            <br />

                            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} >
                                <Button type='button' variant="contained" color="primary" onClick={handleClose} style={{ minWidth: '100px' }} disabled={isLoading}>
                                    Ok
                                </Button>
                                &nbsp;
                                {Number(rowData.request_status) === 0 &&
                                    <Button Button type='button' variant="contained" color="secondary"
                                        onDoubleClick={handleCancel}
                                        style={{ minWidth: '100px' }}
                                        disabled={isLoading}>
                                        Cancel Request
                                    </Button>}
                            </Box>
                        </Box>

                    </CmtCardContent>
                </CmtCard>
            </Dialog>
        </PageContainer>
    );
};

export default EditDialog;

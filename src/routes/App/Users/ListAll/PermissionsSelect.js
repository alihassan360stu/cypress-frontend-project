import React from 'react';
import { Checkbox, TextField, FormGroup, FormControlLabel, Box, Divider } from '@material-ui/core';
import { Button, CircularProgress, Backdrop, Dialog } from '@material-ui/core';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';

const MySwal = withReactContent(Swal);

const initalPermissionsState = {
    cro: false,
    psrms: false,
    hotel_eye: false,
    hr: false,
    dl: false,

    tenant: false,
    ctag: false,
    cfms: false,
    cri: false,
    one_to_one: false,
    fir_copy: false,

    aclc: false,
    excise: false,
    cro_facial: false,
    subscriber: false,
    tasdeeq: false,
    verisys: false,
    save_log: true,
    hidden: false,
    verisys_limit_per_day: 0,
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


const PermissionsSelect = ({ dialogState, setDialogState }) => {
    const [state, setState] = useState(initalPermissionsState)
    const [busy, setBusy] = useState(true);
    const { authUser } = useSelector(({ auth }) => auth);
    const classes = useStyles();

    const showMessage = (icon, text, title) => {
        Toast.fire({
            icon,
            title: text
        });
    }

    const handleChange = event => {
        try {
            var { name, value, checked } = event.target
            if (name === 'verisys_limit_per_day') {
                setState(prevState => ({ ...prevState, [name]: value }));
            } else {
                setState(prevState => ({ ...prevState, [name]: checked }));
            }
        } catch (e) {

        }
    };

    const getPermissions = () => {
        Axios.post(authUser.api_url + '/get-user-permissions', { user_id: dialogState.rowData._id }).then(ans => {
            setBusy(false)
            if (ans.data.status) {
                setState(prevState => ({ ...prevState, ...ans.data.data }))
            } else {
                showMessage('error', ans.data.message);
            }
        }).catch(e => {
            setBusy(false)
            showMessage('error', e);
        })
    }

    const updatePermissions = () => {
        Axios.post(authUser.api_url + '/update-user-permissions', { user_id: dialogState.rowData._id, permissions: JSON.stringify(state) }).then(ans => {
            if (ans.data.status) {
                showMessage('success', ans.data.message);
                setTimeout(() => {
                    setDialogState(prevState => ({ ...prevState, showPerm: false }))
                }, 2000);
            } else {
                setBusy(false)
                showMessage('error', ans.data.message);
            }
        }).catch(e => {
            setBusy(false)
            showMessage('error', e);
        })
    }

    useEffect(() => {
        getPermissions()
    }, [])


    const onSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setBusy(true)
            updatePermissions();
        }
    }

    const validate = () => {
        try {
            const { verisys, verisys_limit_per_day } = state;
            if (verisys && Number(verisys_limit_per_day) < 1) {
                showMessage('error', 'If Verisys Is Allowed So Limit Cannot Be Less Than 1');
                return false;
            }
            return true;
        } catch (e) {
            showMessage('error', e)
            return false;
        }
    }

    const handleClose = (e) => {
        e.preventDefault();
        setTimeout(() => {
            setDialogState(prevState => ({ ...prevState, showPerm: false }))
        }, 100);
    }

    return (
        <PageContainer heading="" breadcrumbs={[]}>
            <Dialog
                id='myTest'
                fullWidth={true}
                maxWidth={'md'}
                scroll={'body'}
                open={dialogState.showPerm}
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
                                Update Permissions
                            </Box>
                        </div>
                        <Divider />
                        <Box display={'flex'} width={'100%'} flexDirection={'row'}>
                            <form autoComplete="off" onSubmit={onSubmit} style={{ width: '100%' }}>
                                <Box style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: '2%' }}>
                                    <FormGroup style={{ width: '100%' }}>
                                        <FormControlLabel
                                            control={<Checkbox checked={state.cro} onChange={handleChange} name="cro" disabled={busy} />}
                                            label="CRO"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.one_to_one} onChange={handleChange} name="one_to_one" disabled={busy} />}
                                            label="NADRA 1:1"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.psrms} onChange={handleChange} name="psrms" color="primary" disabled={busy} />}
                                            label="PSRMS"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.ctag} onChange={handleChange} name="ctag" disabled={busy} />}
                                            label="CTAC"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.cfms} onChange={handleChange} name="cfms" disabled={busy} />}
                                            label="CFMS"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.fir_copy} onChange={handleChange} name="fir_copy" disabled={busy} />}
                                            label="FIR Copy"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.tasdeeq} onChange={handleChange} name="tasdeeq" color="primary" disabled={busy} />}
                                            label="Tasdeeq"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.save_log} onChange={handleChange} name="save_log" disabled={busy} />}
                                            label="Save Log"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.hidden} onChange={handleChange} name="hidden" disabled={busy} />}
                                            label="Hide In Heirarchy"
                                        />
                                    </FormGroup>

                                    <FormGroup style={{ width: '100%' }}>
                                        <FormControlLabel
                                            control={<Checkbox checked={state.cri} onChange={handleChange} name="cri" disabled={busy} />}
                                            label="CRI"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.hr} onChange={handleChange} name="hr" disabled={busy} />}
                                            label="HRMIS"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.dl} onChange={handleChange} name="dl" color="primary" disabled={busy} />}
                                            label="EDL"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.tenant} onChange={handleChange} name="tenant" color="primary" disabled={busy} />}
                                            label="Tenant &nbsp; EMP"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.aclc} onChange={handleChange} name="aclc" color="primary" disabled={busy} />}
                                            label="ACLC"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.excise} onChange={handleChange} name="excise" color="primary" disabled={busy} />}
                                            label="Excise"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.cro_facial} onChange={handleChange} name="cro_facial" color="primary" disabled={busy} />}
                                            label="CRO Facial"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.subscriber} onChange={handleChange} name="subscriber" color="primary" disabled={busy} />}
                                            label="Subscriber"
                                        />

                                        <FormControlLabel
                                            control={<Checkbox checked={state.verisys} onChange={handleChange} name="verisys" disabled={busy} />}
                                            label="Verisys"
                                        />

                                        <TextField
                                            type="text"
                                            label={'Verisys Limit/Day'}
                                            fullWidth
                                            // inputProps={{ pattern: pattern }}
                                            name="verisys_limit_per_day"
                                            value={state.verisys_limit_per_day}
                                            margin="normal"
                                            onChange={handleChange}
                                            variant="outlined"
                                            required
                                            disabled={busy || !state.verisys}
                                        />

                                    </FormGroup>
                                </Box>

                                <Box mb={2}>
                                    <Divider />
                                    <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary" disabled={busy}>
                                        Update
                                    </Button>
                                    <Button style={{ marginTop: 10, marginLeft: 20 }} type='button' variant="contained" color="primary" disabled={busy} onClick={handleClose}>
                                        Cancel
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </CmtCardContent>
                </CmtCard>
            </Dialog>
            <Backdrop className={classes.backdrop} open={busy}>
                <CircularProgress color="secondary" />
            </Backdrop>
        </PageContainer>
    );

    // return (
    //     <Box display={'flex'} width={'100%'} flexDirection={'column'}>
    //         <Box fontSize={{ xs: 14, sm: 16 }} display={'flex'} justifyContent={'center'} component="h1" color="text">
    //             Update Permissions
    //         </Box>
    //         <Divider />
    //         <br />

    //         <CmtCard style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: '2%' }}>
    //             <FormGroup >
    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.cro} onChange={handleChange} name="cro" disabled={busy} />}
    //                     label="CRO"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.one_to_one} onChange={handleChange} name="one_to_one" disabled={busy} />}
    //                     label="NADRA 1:1"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.psrms} onChange={handleChange} name="psrms" color="primary" disabled={busy} />}
    //                     label="PSRMS"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.ctag} onChange={handleChange} name="ctag" disabled={busy} />}
    //                     label="CTAC"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.cfms} onChange={handleChange} name="cfms" disabled={busy} />}
    //                     label="CFMS"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.fir_copy} onChange={handleChange} name="fir_copy" disabled={busy} />}
    //                     label="FIR Copy"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.tasdeeq} onChange={handleChange} name="tasdeeq" color="primary" disabled={busy} />}
    //                     label="Tasdeeq"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.tasdeeq} onChange={handleChange} name="tasdeeq" color="primary" disabled={busy} />}
    //                     label="Tasdeeq"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.verisys} onChange={handleChange} name="verisys" disabled={busy} />}
    //                     label="Verisys"
    //                 />
    //             </FormGroup>

    //             <FormGroup >
    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.cri} onChange={handleChange} name="cri" disabled={busy} />}
    //                     label="CRI"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.hr} onChange={handleChange} name="hr" disabled={busy} />}
    //                     label="HRMIS"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.dl} onChange={handleChange} name="dl" color="primary" disabled={busy} />}
    //                     label="EDL"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.tenant} onChange={handleChange} name="tenant" color="primary" disabled={busy} />}
    //                     label="Tenant &nbsp; EMP"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.aclc} onChange={handleChange} name="aclc" color="primary" disabled={busy} />}
    //                     label="ACLC"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.excise} onChange={handleChange} name="excise" color="primary" disabled={busy} />}
    //                     label="Excise"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.cro_facial} onChange={handleChange} name="cro_facial" color="primary" disabled={busy} />}
    //                     label="CRO Facial"
    //                 />

    //                 <FormControlLabel
    //                     control={<Checkbox checked={state.subscriber} onChange={handleChange} name="subscriber" color="primary" disabled={busy} />}
    //                     label="Subscriber"
    //                 />

    //                 <TextField
    //                     type="text"
    //                     label={'Verisys Limit/Day'}
    //                     fullWidth
    //                     // inputProps={{ pattern: pattern }}
    //                     name="verisys_limit_per_day"
    //                     value={state.verisys_limit_per_day}
    //                     margin="normal"
    //                     onChange={handleChange}
    //                     variant="outlined"
    //                     required
    //                     disabled={busy}
    //                 />

    //             </FormGroup>
    //         </CmtCard>
    //     </Box>
    // );
};

export default PermissionsSelect;

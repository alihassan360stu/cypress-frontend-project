import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, Dialog, TextField, MenuItem, CircularProgress, Backdrop, Typography } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import { green } from '@material-ui/core/colors';
import axios from 'axios'
import Contstants from '@services/Contstants';
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
    verifiedTitle: {
        color: green[700],
        fontWeight: 800,
        lineHeight: 1.5,
        marginBottom: 20,
        textShadow: '10px 4px 10px hsla(0,0%,45.9%,.8)',
    },
    pageTitle: {
        color: theme.palette.text.primary,
        fontWeight: 800,
        lineHeight: 1.5,
        // marginBottom: 20,
        // textShadow: '2px 4px 4px hsla(0,0%,45.9%,.8)',
        width: '100%',
        textAlign: 'left'
    },
    pageMainTitle: {
        color: theme.palette.text.primary,
        fontWeight: 800,
        lineHeight: 1.5,
        marginBottom: 20,
        textShadow: '2px 4px 4px hsla(0,0%,45.9%,.8)',
        width: '100%',
        // textAlign: 'center'
    },
    pageSubTitle: {
        color: theme.palette.text.primary,
        fontWeight: 800,
        lineHeight: 1.5,
        // marginBottom: 20,
        width: '100%',
        textAlign: 'left'
    },
    divider: {
        width: '100%',
        minHeight: 1.2,
    },
    instructions: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
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
    disposal_type_id: -1,
}

const Disposal = ({ data, reloadData }) => {
    const { authUser } = useSelector(({ auth }) => auth);
    const [showDialog, setShowDialog] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [state, setState] = useState(initialState)
    const [canSubmitDisp, setCanSubmitDisp] = useState(false)
    const [disposalTypes, setDisposalTypes] = useState([])

    var edge = '';
    if (authUser.assoc_id) {
        edge = '/assoc'
    } else if (authUser.comp_id) {
        edge = '/comp'
    }

    const showMessage = (icon, text) => {
        Toast.fire({
            icon,
            title: text
        });
    }

    const loadDisposalTypes = () => {
        return new Promise((resolve, reject) => {
            try {
                Axios.post('/client/getDisposalTypes').then(ans => {
                    ans = ans.data;
                    if (ans.status) {
                        setDisposalTypes(ans.data)
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

    const validate = () => {
        const { disposal_type_id, remarks } = state;
        if (disposal_type_id === -1) {
            showMessage('error', 'Please Select Disposal Type To Continue')
            return false;
        }

        if (remarks.length < 6) {
            showMessage('error', 'Please Enter Remarks Of Atleast 6 Words')
            return false;
        }

        return true;
    }

    const submitRequest = () => {
        return new Promise((resolve, reject) => {
            try {
                const { disposal_type_id, remarks } = state
                var urlAction = authUser.role === 'Disposal Master' ? 'submitdispdm' : 'submitdispdist';
                Axios.post('/client/' + urlAction, { emp_history_id: data.emp_history_id, disposal_type_id, remarks, verification_id: data.id }).then(ans => {
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
                var msg = await submitRequest();
                showMessage('success', msg)
                setTimeout(() => {
                    reloadData();
                    setShowDialog(false);
                    setIsLoading(false);
                }, 3000);
            } catch (e) {
                setIsLoading(false);
                showMessage('error', e)
            }
        }
    }

    const handleClick = async (e) => {
        e.preventDefault();
        if (disposalTypes.length > 0) {
            // handleOpenDialog();
            setShowDialog(true)
        } else {
            try {
                setIsLoading(true);
                await loadDisposalTypes();
                setShowDialog(true)
            } catch (e) {
                showMessage('error', e)
            }
        }
    }

    const checkIfCanSubmitDisp = (emp_history_id) => {
        return new Promise((resolve, reject) => {
            try {
                axios.post(authUser.api_url + edge + '/emp/ifcansubmitdisp', { emp_history_id }).then(ans => {
                    if (ans.status) {
                        setCanSubmitDisp(true)
                        resolve(true)
                    } else {
                        setCanSubmitDisp(false)
                        resolve(true)
                    }
                }).catch(e => {
                    setTimeout(() => {
                        setCanSubmitDisp(false)
                        resolve(true)
                    }, 500);
                    showMessage('error', e)
                })
            } catch (e) {
                setTimeout(() => {
                    setCanSubmitDisp(false)
                    resolve(true)
                }, 500);
                showMessage('error', e)
            }
        })
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

    var roles = ["Disposal Master", "District"];
    useEffect(() => {
        try {
            async function fetchData() {
                await checkIfCanSubmitDisp(data.emp_history_id)
                // await checkIfCanSubmitDisp(data.id);
            }
            if (roles.indexOf(authUser.role) !== -1) {
                fetchData();
            }
        } catch (e) {
            setCanSubmitDisp(false)
            showMessage('error', 'Invalid URI Parameter')
        }
    }, [])
    const classes = useStyles();
    // return (
    //     <h1>
    //         Hello Disposal
    //     </h1>
    // )

    setTimeout(() => console.log(data), 2000)

    var disposed_by = '';
    if (data.is_disposed_by_dm) {
        switch (Number(data.is_disposed_by_dm)) {
            case 1:
                disposed_by = 'Disposal Master';
                break;
            case 2:
                disposed_by = 'District ' + data.district_name;
                break;
            case 3:
                disposed_by = 'Administrator EVS';
                break;
        }
    }

    if (data.disposal) {
        return (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h1' className={classes.pageMainTitle} > Disposal Details </Typography>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Disposal Type </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.diposal_type_title} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Disposed By </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {disposed_by} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Disposed By User</Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.disposed_by_user} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Disposal </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.disposal} </Typography>
                </Box>
            </Box>
        )
    } else {
        return (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'start'} width={'100%'} className={classes.root}>
                    <Typography variant='h1' className={classes.pageMainTitle}> No Disposal Submitted </Typography>
                </Box>
                <Divider className={classes.divider} />
                <br />

                {roles.indexOf(authUser.role) !== -1 && canSubmitDisp &&
                    <Button variant='contained' color="secondary" onClick={handleClick}> Submit Disposal </Button>
                }

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
                                    Submit Disposal
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
                                        name='disposal_type_id'
                                        fullWidth
                                        value={state.disposal_type_id}
                                        onChange={handleOnChange}
                                        variant="outlined" >

                                        <MenuItem key={10002} value={-1}>
                                            Not Selected
                                        </MenuItem>

                                        {
                                            disposalTypes.map(type => (
                                                <MenuItem key={type.id} value={type.id}>
                                                    {type.title}
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
                                        Submit Disposal
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
    }

};

export default Disposal;

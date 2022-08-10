import React, { useEffect, useState } from 'react';
import { Grid, Box, CircularProgress, Backdrop } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import CmtAvatar from '@coremat/CmtAvatar';
import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Constants } from '@services'
import axios from 'axios'
import PersonalInfo from './PersonalInfo'
import EmploymentInfo from './EmploymentInfo'
import WitnessInfo from './WitnessInfo'
import Actions from './Actions'
import { MediaViewer } from '../'

var crypto = require('crypto');


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
    button: {
        marginRight: theme.spacing(2),
    },
    backButton: {
        marginRight: theme.spacing(2),
    },
    completed: {
        display: 'inline-block',
    },
    instructions: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    avatar: {
        boxShadow: '6px 6px 6px hsla(0,0%,45.9%,.8)',
        borderRadius: '50%'
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


const EmployeeDetails = ({ match }) => {

    const classes = useStyles();

    const { authUser } = useSelector(({ auth }) => auth);

    const [mediaPosition, setMediaPosition] = useState(-1);
    const [medaPreview, setMedaPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [witnessData, setWitnessData] = useState(null);
    const [isData, setIsData] = useState(false);

    const showMessage = (icon, text) => {
        Toast.fire({
            icon,
            title: text
        });
    }

    const loadData = (emp_history_id) => {
        try {
            axios.post(authUser.api_url + '/emp/get', { emp_history_id }).then(ans => {
                setIsLoading(false)
                ans = ans.data
                if (ans.status) {
                    const tData = ans.data[0]
                    setData(tData)
                    setIsData(true)

                    try {
                        if (tData.is_first_witness || tData.is_second_witness) {
                            setIsLoading(true)
                            loadWitnesses(emp_history_id);
                        }
                    } catch (e) {

                    }
                } else {
                    setIsData(false)
                    showMessage('error', ans.message)
                }
            }).catch(e => {
                setIsLoading(false)
                setIsData(false)
                showMessage('error', e)
            })
        } catch (e) {
            setIsLoading(false)
            setIsData(false)
            showMessage('error', e)
        }
    }

    const loadWitnesses = (emp_history_id) => {
        try {
            axios.post(authUser.api_url + '/emp/getwitness', { emp_history_id }).then(ans => {
                setIsLoading(false)
                ans = ans.data
                if (ans.status) {
                    setWitnessData(ans.data)
                } else {
                    showMessage('error', ans.message)
                }
            }).catch(e => {
                setIsLoading(false)
                showMessage('error', e)
            })
        } catch (e) {
            setIsLoading(false)
            showMessage('error', e)
        }
    }

    const handleMediaClose = () => {
        setMediaPosition(-1)
    }
    const handleMediaClick = (e) => {
        try {
            e.preventDefault();
            setMedaPreview(e.target.src)
            setMediaPosition(0)
        } catch (e) {
            showMessage('error', e)
        }
    }

    const reloadData = () => {
        setMediaPosition(-1);
        setMedaPreview(null);
        setData(false);
        setIsData(false);
        setIsLoading(true);
        loadData(data.id)
    }

    useEffect(() => {
        try {
            var decipher = crypto.createDecipher(Constants.ALGO, Constants.TKV);
            var emp_id = decipher.update(match.params.id, 'hex', 'utf8') + decipher.final('utf8');
            loadData(emp_id);
        } catch (e) {
            setIsLoading(false)
            showMessage('error', 'Invalid URI Parameter')
        }
    }, [])

    return (
        <PageContainer heading="" id='myTest'>
            <GridContainer>
                <Grid item xs={12}>
                    <div>
                        <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
                            Employee Details
                        </Box>
                    </div>
                    <Divider />
                    <br /> 
                </Grid>
            </GridContainer>
            {isData && (
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
                    <CmtAvatar style={{ alignSelf: 'left', alignItems: 'left', justifyContent: 'left', justifyItems: 'left' }} className={classes.avatar} color="random" size={200} variant="circular" alt="avatar" src={`${Constants.IMG_URL}/${data.picture}`} onClick={handleMediaClick} />
                    <MediaViewer position={mediaPosition} medias={[{ preview: medaPreview, name: 'Test', metaData: { type: 'image' } }]} handleClose={handleMediaClose} />
                    <br />
                    {/* <Divider style={{ width: '100%' }} />
                    <br /> */}
                    <PersonalInfo data={data} />
                    <EmploymentInfo data={data} />
                    {witnessData && <WitnessInfo data={witnessData} />}
                    {!data.emp_end_reason_id && <Actions data={data} reloadData={reloadData} />}
                </Box>
            )}
            <Backdrop className={classes.backdrop} open={isLoading}>
                <CircularProgress color="secondary" />
            </Backdrop>
        </PageContainer>
    );
};

export default EmployeeDetails;

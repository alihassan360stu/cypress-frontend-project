import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles, alpha, useTheme, lighten } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Box, CircularProgress, Grid } from '@material-ui/core';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Constants } from '@services'
import axios from 'axios'
import { useSelector } from 'react-redux';
import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import BioData from './BioData'
import Disposal from './Disposal'
import SwipeableViews from 'react-swipeable-views';

var crypto = require('crypto');
const MySwal = withReactContent(Swal);
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}>
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </Box>
    );
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

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`
        // centered: true
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        maxWidth: '100%',
        // padding: '2%',
        // margin: '0 auto',
        backgroundColor: theme.palette.background.paper,
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

    rootLoading: {
        maxWidth: '100vh',
        padding: '2%',
        margin: '0 auto',
        backgroundColor: lighten(theme.palette.background.paper, 0.1),

    },
    button: {
        marginRight: theme.spacing(2),
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

const AntTabs = withStyles({
    root: {
        borderBottom: '2px solid #e8e8e8',
    },
    indicator: {
        backgroundColor: '#6A03DD',
        // height: 2.5,
        // fontWeight: 400,
        // marginLeft: 20,
        // marginRight: 20
    },
})(Tabs);

const AntTabNormal = withStyles(theme => ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        flexGrow: 1,
        fontWeight: theme.typography.fontWeightMedium,
        marginRight: theme.spacing(1),
        fontSize: 16,
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:hover': {
            color: '#640AF8',
            opacity: 1,
        },
        '&$selected': {
            color: '#853FF9',
            fontWeight: theme.typography.fontWeightBold,
        },
        '&:focus': {
            color: '#640AF8',
        },
    },
    indicatorColor: {
        backgroundColor: '#640AF8',
    },
    selected: {},
}))(props => <Tab  {...props} />);



const EmployeeDetails = ({ match }) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const { authUser } = useSelector(({ auth }) => auth);
    const theme = useTheme();
    const [isLoadingBio, setIsLoadingBio] = useState(true);
    const [empID, setEmpID] = useState(null);

    const [bioData, setBioData] = useState(null);
    const [isBioData, setIsBioData] = useState(false);

    const [witnessData, setWitnessData] = useState(null);

    const [isCriminal, setIsCriminal] = useState(false);
    const [isLoadingDisp, setIsLoadingDisp] = useState(true);
    const [dispData, setDisData] = useState(null);

    const showMessage = (icon, text) => {
        Toast.fire({
            icon,
            title: text
        });
    }

    const getLoadingStatus = (status) => {
        return (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.rootLoading}>
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.rootLoading}>
                    <Typography variant='h1' className={classes.pageMainTitle}> {status}  <CircularProgress size={30} color="secondary" /> </Typography>
                </Box>
            </Box>
        )
    }

    const loadBioData = (emp_history_id) => {
        return new Promise((resolve, reject) => {
            try {
                axios.post(authUser.api_url + '/emp/get', { emp_history_id }).then(async ans => {
                    setTimeout(() => {
                        setIsLoadingBio(false)
                    }, 500);

                    ans = ans.data
                    
                    if (ans.status) {
                        const tData = ans.data[0]
                        setBioData(tData)
                        setIsBioData(true)
                        try {
                            if (tData.is_first_witness || tData.is_second_witness) {
                                setIsLoadingBio(true)
                                await loadWitnesses(emp_history_id);
                                resolve(true)
                            }
                        } catch (e) {
                            resolve(true)
                        }
                    } else {
                        setIsBioData(false)
                        showMessage('error', ans.message)
                        resolve(true)
                    }
                }).catch(e => {
                    setTimeout(() => {
                        setIsLoadingBio(false)
                    }, 500);
                    setIsBioData(false)
                    showMessage('error', e)
                    resolve(true)
                })
            } catch (e) {
                setTimeout(() => {
                    setIsLoadingBio(false)
                    resolve(true)
                }, 500);
                setIsBioData(false)
                showMessage('error', e)

            }
        })
    }

    const loadWitnesses = (emp_history_id) => {
        return new Promise((resolve, reject) => {
            try {
                axios.post(authUser.api_url  + '/emp/getwitness', { emp_history_id }).then(ans => {
                    setTimeout(() => {
                        setIsLoadingBio(false)
                    }, 500);
                    ans = ans.data
                    
                    if (ans.status) {
                        setWitnessData(ans.data)
                        resolve(true)
                    } else {
                        resolve(true)
                        // showMessage('error', ans.message)
                    }
                }).catch(e => {
                    setTimeout(() => {
                        setIsLoadingBio(false)
                        resolve(true)
                    }, 500);
                    showMessage('error', e)
                })
            } catch (e) {
                setTimeout(() => {
                    setIsLoadingBio(false)
                    resolve(true)
                }, 500);
                showMessage('error', e)
            }
        })
    }

    const checkIfCriminal = (emp_history_id) => {
        return new Promise((resolve, reject) => {
            try {
                axios.post('client/checIfCriminal', { emp_history_id }).then(ans => {
                    setTimeout(() => {
                        setIsLoadingBio(false)
                        setIsLoadingDisp(false)
                    }, 500);
                    ans = ans.data
                    
                    if (ans.status) {
                        setIsCriminal(true)
                        setDisData(ans.data[0])
                        resolve(true)
                    } else {
                        resolve(true)
                        // showMessage('error', ans.message)
                    }
                }).catch(e => {
                    setTimeout(() => {
                        setIsLoadingBio(false)
                        setIsLoadingDisp(false)
                        resolve(true)
                    }, 500);
                    showMessage('error', e)
                })
            } catch (e) {
                setTimeout(() => {
                    setIsLoadingBio(false)
                    setIsLoadingDisp(false)
                    resolve(true)
                }, 500);
                showMessage('error', e)
            }
        })
    }

    useEffect(() => {
        try {
            async function fetchData() {
                var decipher = crypto.createDecipher(Constants.ALGO, Constants.TKV);
                var emp_id = decipher.update(match.params.id, 'hex', 'utf8') + decipher.final('utf8');
                setEmpID(emp_id);
                loadBioData(emp_id);
                // await loadNadraData(emp_id);
                // await loadCtagData(emp_id);
                // await loadPSRMSData(emp_id);
                // await loadCROData(emp_id);
                // await loadCRIData(emp_id);
                // await loadCFMSData(emp_id);
                checkIfCriminal(emp_id);
            }
            fetchData();
        } catch (e) {
            setIsLoadingBio(false)
            showMessage('error', 'Invalid URI Parameter')
        }
    }, [])

    const reloadDisposal = () => {
        try {
            setIsLoadingDisp(true);
            checkIfCriminal(empID);
        } catch (error) {
            showMessage('error', error)
        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
        // alert('here')
    };

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

            <Box className={classes.root}>
                <AppBar position="static" color="default">
                    <AntTabs value={value} onChange={handleChange} aria-label="ant example">

                        <AntTabNormal label="Bio Data"   {...a11yProps(0)} />
                        {isCriminal &&
                            <AntTabNormal label="Disposal"   {...a11yProps(1)} />
                        }
                    </AntTabs>
                </AppBar>
                <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex} >
                    <TabPanel value={value} index={0}>
                        <Grid>
                            {!isLoadingBio ?
                                <BioData isLoading={isLoadingBio} bioData={bioData} isBioData={isBioData} witnessDataParent={witnessData} />
                                : getLoadingStatus('Loading Bio Data Please Wait')}
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Grid>
                            {!isLoadingDisp ?
                                <Disposal data={dispData} reloadData={reloadDisposal} />
                                : getLoadingStatus('Loading Disposal Please Wait')}
                        </Grid>
                    </TabPanel>
                </SwipeableViews>
            </Box>
        </PageContainer >
    );
}

export default EmployeeDetails;
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
import NADRA from './NADRA'
import CTAG from './CTAG'
import PSRMS from './PSRMS'
import CRO from './CRO'
import CRI from './CRI'
import CFMS from './CFMS'
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

const AntTabRed = withStyles(theme => ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        color: "red",
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
            color: '#FC0104',
            opacity: 1,
        },
        '&$selected': {
            color: '#E90508',
            fontWeight: theme.typography.fontWeightBold,
        },
        '&:focus': {
            color: '#E90508',
        },
    },
    selected: {},
}))(props => <Tab  {...props} />);

const AntTabGreen = withStyles(theme => ({
    root: {
        textTransform: 'none',
        minWidth: 72,
        color: "green",
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
            color: '#2ACD27',
            opacity: 1,
        },
        '&$selected': {
            color: '#03B900',
            fontWeight: theme.typography.fontWeightBold,
        },
        '&:focus': {
            color: '#03B900',
        },
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

    const [isLoadingNADRA, setIsLoadingNADRA] = useState(true);
    const [nadraData, setNadraData] = useState(null);

    const [ctagData, setCtagData] = useState(null);
    const [isLoadingCtag, setIsLoadingCtag] = useState(true);

    const [psrmsData, setPSRMSData] = useState(null);
    const [isLoadingPSRMS, setIsLoadingPSRMS] = useState(true);

    const [croData, setCROData] = useState(null);
    const [isLoadingCRO, setIsLoadingCRO] = useState(true);

    const [criData, setCRIData] = useState(null);
    const [isLoadingCRI, setIsLoadingCRI] = useState(true);

    const [cfmsData, setCFMSData] = useState(null);
    const [isLoadingCFMS, setIsLoadingCFMS] = useState(true);

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

    var edge = '';
    if (authUser.assoc_id) {
        edge = '/assoc'
    } else if (authUser.comp_id) {
        edge = '/comp'
    }

    const loadBioData = (emp_history_id) => {
        return new Promise((resolve, reject) => {
            try {
                axios.post(authUser.api_url + edge + '/emp/get', { emp_history_id }).then(async ans => {
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

    const loadNadraData = (emp_history_id) => {
        return new Promise((resolve, reject) => {
            try {
                axios.post('client/getNadra', { emp_history_id }).then(ans => {
                    ans = ans.data;
                    
                    if (ans.status) {
                        setNadraData(ans.data[0])
                    }
                    setIsLoadingNADRA(false);
                    resolve(true)
                }).catch(e => {
                    resolve(true)
                    setIsLoadingNADRA(false);
                    showMessage('error', e)
                });
            } catch (e) {
                resolve(true)
                setIsLoadingNADRA(false);
                showMessage('error', e)
            }
        })
    }

    const loadCtagData = (emp_history_id) => {
        return new Promise((resolve, reject) => {
            try {
                axios.post('client/getCtag', { emp_history_id }).then(ans => {
                    ans = ans.data;
                    
                    if (ans.status) {
                        setCtagData(ans.data)
                    }
                    setIsLoadingCtag(false);
                    resolve(true)
                    // else {
                    //     // showMessage('error', ans.message)
                    // }
                }).catch(e => {
                    resolve(true)
                    setIsLoadingCtag(false);
                    showMessage('error', e)
                });
            } catch (e) {
                resolve(true)
                setIsLoadingCtag(false);
                showMessage('error', e)
            }
        })
    }

    const loadPSRMSData = (emp_history_id) => {
        return new Promise((resolve, reject) => {
            try {
                axios.post('client/getPSRMS', { emp_history_id }).then(ans => {
                    ans = ans.data;
                    
                    if (ans.status) {
                        setPSRMSData(ans.data)
                    }
                    setIsLoadingPSRMS(false);
                    resolve(true)
                    // else {
                    //     // showMessage('error', ans.message)
                    // }
                }).catch(e => {
                    resolve(true)
                    setIsLoadingPSRMS(false);
                    showMessage('error', e)
                });
            } catch (e) {
                resolve(true)
                setIsLoadingPSRMS(false);
                showMessage('error', e)
            }
        })
    }

    const loadCROData = (emp_history_id) => {
        return new Promise((resolve, reject) => {
            try {
                axios.post('client/getCRO', { emp_history_id }).then(ans => {
                    ans = ans.data;
                    
                    if (ans.status) {
                        setCROData(ans.data)
                    }
                    setIsLoadingCRO(false);
                    resolve(true);
                    // else {
                    //     // showMessage('error', ans.message)
                    // }
                }).catch(e => {
                    resolve(true);
                    setIsLoadingCRO(false);
                    showMessage('error', e)
                });
            } catch (e) {
                resolve(true);
                setIsLoadingCRO(false);
                showMessage('error', e)
            }
        })
    }

    const loadCRIData = (emp_history_id) => {
        return new Promise((resolve, reject) => {
            try {
                axios.post('client/getCRI', { emp_history_id }).then(ans => {
                    ans = ans.data;
                    
                    if (ans.status) {
                        setCRIData(ans.data)
                    }
                    setIsLoadingCRI(false);
                    resolve(true);
                    // else {
                    //     // showMessage('error', ans.message)
                    // }
                }).catch(e => {
                    resolve(true);
                    setIsLoadingCRI(false);
                    showMessage('error', e)
                });
            } catch (e) {
                resolve(true);
                setIsLoadingCRI(false);
                showMessage('error', e)
            }
        });
    }

    const loadCFMSData = (emp_history_id) => {
        return new Promise((resolve, reject) => {
            try {
                axios.post('client/getCFMS', { emp_history_id }).then(ans => {
                    ans = ans.data;
                    
                    if (ans.status) {
                        setCFMSData(ans.data)
                    }
                    setIsLoadingCFMS(false);
                    resolve(true);
                    // else {
                    //     // showMessage('error', ans.message)
                    // }
                }).catch(e => {
                    setIsLoadingCFMS(false);
                    showMessage('error', e)
                    resolve(true);
                });
            } catch (e) {
                setIsLoadingCFMS(false);
                showMessage('error', e)
                resolve(true);
            }
        })
    }

    const loadWitnesses = (emp_history_id) => {
        return new Promise((resolve, reject) => {
            try {
                axios.post(authUser.api_url + edge + '/emp/getwitness', { emp_history_id }).then(ans => {
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
                loadNadraData(emp_id);
                loadCtagData(emp_id);
                loadPSRMSData(emp_id);
                loadCROData(emp_id);
                loadCRIData(emp_id);
                loadCFMSData(emp_id);
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

                        {(nadraData && nadraData.return_code === 6) ?
                            <AntTabRed label="NADRA"  {...a11yProps(1)} />
                            : <AntTabNormal label="NADRA"  {...a11yProps(1)} />}

                        {isLoadingCtag ?
                            <AntTabNormal label="CTAG"  {...a11yProps(2)} />
                            : ctagData && ctagData.length > 0 ? <AntTabRed label="CTAG"  {...a11yProps(2)} />
                                :
                                <AntTabGreen label="CTAG"  {...a11yProps(2)} />
                        }
                        {isLoadingPSRMS ?
                            <AntTabNormal label="PSRMS/FIR"  {...a11yProps(3)} />
                            : psrmsData && psrmsData.length > 0 ? <AntTabRed label="PSRMS/FIR"  {...a11yProps(3)} />
                                :
                                <AntTabGreen label="PSRMS/FIR"  {...a11yProps(3)} />
                        }
                        {isLoadingCRO ?
                            <AntTabNormal label="CRO"  {...a11yProps(4)} />
                            : croData && croData.length > 0 ? <AntTabRed label="CRO"  {...a11yProps(4)} />
                                :
                                <AntTabGreen label="CRO"  {...a11yProps(4)} />
                        }
                        {isLoadingCRI ?
                            <AntTabNormal label="CRI"  {...a11yProps(5)} />
                            : criData && criData.length > 0 ? <AntTabRed label="CRI"  {...a11yProps(5)} />
                                :
                                <AntTabGreen label="CRI"  {...a11yProps(5)} />
                        }
                        {isLoadingCFMS ?
                            <AntTabNormal label="CFMS"  {...a11yProps(6)} />
                            : cfmsData && cfmsData.length > 0 ? <AntTabRed label="CFMS"  {...a11yProps(6)} />
                                :
                                <AntTabGreen label="CFMS"  {...a11yProps(6)} />
                        }

                        {isCriminal &&
                            <AntTabNormal label="Disposal"   {...a11yProps(7)} />
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
                            {!isLoadingNADRA ?
                                <NADRA data={nadraData} />
                                : getLoadingStatus('Loading NADRA Data Please Wait')}
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Grid>
                            {!isLoadingCtag ?
                                <CTAG data={ctagData} />
                                : getLoadingStatus('Loading CTAG Data Please Wait')}
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Grid>
                            {!isLoadingPSRMS ?
                                <PSRMS data={psrmsData} />
                                : getLoadingStatus('Loading PSRMS/FIR Data Please Wait')}
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        <Grid>
                            {!isLoadingCRO ?
                                <CRO data={croData} />
                                : getLoadingStatus('Loading CRO Data Please Wait')}
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={5}>
                        <Grid>
                            {!isLoadingCRI ?
                                <CRI data={criData} />
                                : getLoadingStatus('Loading CRI Data Please Wait')}
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={6}>
                        <Grid>
                            {!isLoadingCFMS ?
                                <CFMS data={cfmsData} />
                                : getLoadingStatus('Loading CFMS Data Please Wait')}
                        </Grid>
                    </TabPanel>

                    <TabPanel value={value} index={7}>
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
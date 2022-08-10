import React, { useEffect } from 'react';
import { Box, Divider, makeStyles, TextField, MenuItem, lighten, CircularProgress } from '@material-ui/core';
import { fetchError, } from '@redux/actions';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';


const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '100vh',
        // padding: '2%',
        margin: '0 auto',
        backgroundColor: lighten(theme.palette.background.paper, 0.1),
    },
    btnRoot: {
        [theme.breakpoints.down('xs')]: {
            padding: '6px 12px',
            fontSize: 11,
        },
    },
    circularProgressRoot: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));


const LevelSelector = ({ state, setState }) => {
    const classes = useStyles();
    const { authUser } = useSelector(({ auth }) => auth);
    const dispatch = useDispatch();


    const handleChange = (event) => {
        event.preventDefault()
        var { name, value } = event.target
        setState(prevState => ({ ...prevState, [name]: value }));
    }

    const handleRangeZoneChange = (event) => {
        event.preventDefault()
        var { name, value } = event.target
        var is_loading = Number(value) !== -1 ? true : false;

        setState(prevState => ({ ...prevState, [name]: value, district_id: -1, ps_id: -1, ps: [], districts: [], is_loading }))

        if (is_loading)
            setTimeout(() => {
                getDistrictsByRange(value).then(districts => {
                    setState(prevState => ({ ...prevState, districts, is_loading: false }));
                }).catch(e => {
                    setState(prevState => ({ ...prevState, is_loading: false }));
                    dispatch(fetchError(e))
                })
            }, 300);
    }

    const handleDistrictChange = (event) => {
        event.preventDefault()
        var { name, value } = event.target

        var is_loading = Number(value) !== -1 ? true : false;
        setState(prevState => ({ ...prevState, [name]: value, ps_id: -1, ps: [], is_loading }));

        if (is_loading)
            setTimeout(async () => {
                getPsByDistrictId(value).then(ps => {
                    setState(prevState => ({ ...prevState, ps, is_loading: false }));
                }).catch(e => {
                    setState(prevState => ({ ...prevState, is_loading: false }));
                    dispatch(fetchError(e))
                })
            }, 300);
    }

    const getDistrictsByRange = (id) => {
        return new Promise(async (resolve, reject) => {
            Axios.post(authUser.api_url + '/general/getDistrictByParentId', { id }).then(ans => {
                ans = ans.data
                if (ans.status) {
                    resolve(ans.data)
                } else {
                    reject(ans.message)
                }
            }).catch(e => {
               
                reject('Something Went Wrong !. Please Try Again Later')
            })
        })
    }

    const getPsByDistrictId = (id) => {
        return new Promise(async (resolve, reject) => {
            Axios.post(authUser.api_url + '/general/getPsByDistrictId', { id }).then(ans => {
                ans = ans.data
                if (ans.status) {
                    resolve(ans.data)
                } else {
                    reject(ans.message)
                }
            }).catch(e => {
               
                reject('Something Went Wrong !. Please Try Again Later')
            })
        })
    }

    const getRangeZones = () => {
        return new Promise(async (resolve, reject) => {
            Axios.post(authUser.api_url + '/general/getAllRangeZones').then(ans => {
                if (ans.data.status)
                    resolve(ans.data.data)
                else
                    reject('Something Went Wrong !. Please Try Again Later')
            }).catch(e => {
               
                reject('Something Went Wrong !. Please Try Again Later')
            })
        })
    }


    useEffect(() => {
        var loadData = async () => {
            if (state.rangeZones) {
                if (state.rangeZones.length < 1) {
                    try {
                        setState(prevState => ({ ...prevState, is_loading: true }));
                        var rangeZones = await getRangeZones();
                        setState(prevState => ({ ...prevState, rangeZones, is_loading: false }));
                    } catch (e) {
                       
                        setState(prevState => ({ ...prevState, is_loading: false }));
                    }
                }
            }
        }

        loadData();
    }, []);

    return (
        <Box className={classes.root}>
            {state.is_loading ?
                <div className={classes.circularProgressRoot}>
                    <CircularProgress />
                </div>
                : ''}

            <Box fontSize={{ xs: 14, sm: 16 }} display={'flex'} justifyContent={'center'} component="h2" color="text">
                Select Access Level For Police
            </Box>
            <Divider />
            <Box>
                <Box display="flex" alignItems="center" className={classes.actionButtons}>
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Select Range/Zone"
                        margin='normal'
                        name='rangeZoneId'
                        fullWidth
                        value={state.rangeZoneId}
                        onChange={handleRangeZoneChange}
                        variant="outlined">
                        <MenuItem key={10002} value={-1}>
                            Not Applicable
                        </MenuItem>

                        {state.rangeZones.map(rangeZone => (
                            <MenuItem key={rangeZone.id} value={rangeZone.id}>
                                {rangeZone.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    &nbsp;&nbsp;
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Select District"
                        margin='normal'
                        name='district_id'
                        fullWidth
                        value={state.district_id}
                        onChange={handleDistrictChange}
                        variant="outlined">

                        <MenuItem key={10004} value={-1}>
                            Not Applicable
                        </MenuItem>

                        {state.districts.map(district => (
                            <MenuItem key={district.id} value={district.id}>
                                {district.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    &nbsp;&nbsp;
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Select Police Station"
                        margin='normal'
                        name='ps_id'
                        fullWidth
                        value={state.ps_id}
                        onChange={handleChange}
                        variant="outlined">

                        <MenuItem key={10001} value={-1}>
                            Not Applicable
                        </MenuItem>

                        {state.ps.map(p => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>
        </Box>
    );
};

export default LevelSelector;

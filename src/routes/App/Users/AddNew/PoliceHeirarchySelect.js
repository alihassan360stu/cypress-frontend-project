import React, { useEffect } from 'react';
import { Box, Divider, makeStyles, TextField, MenuItem, lighten, CircularProgress } from '@material-ui/core';
import { fetchError, } from '@redux/actions';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useState } from 'react';


const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100vh',
    width: '100%',
    // padding: '2%',
    // margin: '0 auto',
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


const LevelSelector = ({ state, setState, level }) => {
  const classes = useStyles();
  const { authUser } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    event.preventDefault()
    var { name, value } = event.target
    setState(prevState => ({ ...prevState, [name]: value }));
  }

  const handleRegionChange = (event) => {
    event.preventDefault()
    var { name, value } = event.target
    setState(prevState => ({ ...prevState, [name]: value }))
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

  const getDistrictsByRange = (parent_id) => {
    return new Promise(async (resolve, reject) => {
      Axios.post(authUser.api_url + '/get-district-by-parent', { parent_id }).then(ans => {
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

  const getPsByDistrictId = (district_id) => {
    return new Promise(async (resolve, reject) => {
      Axios.post(authUser.api_url + '/get-ps-by-district', { district_id }).then(ans => {
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

  return (
    <Box className={classes.root}>
      <Box fontSize={{ xs: 14, sm: 16 }} display={'flex'} justifyContent={'center'} component="h2" color="text">
        Select Access Level
      </Box>
      <Divider />
      <Box>
        <Box display="flex" alignItems="center" className={classes.actionButtons}>
          {level === 0 &&
            <TextField
              id="outlined-select-currency"
              select
              label="Select Region"
              margin='normal'
              name='region_id'
              fullWidth
              value={state.region_id}
              onChange={handleRegionChange}
              variant="outlined">
              <MenuItem key={1002202} value={-1}>
                Not Applicable
              </MenuItem>

              {state.regions.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          }
          &nbsp;&nbsp;
          {level > 0 &&
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

              {state.rangeZones.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          }
          &nbsp;&nbsp;
          {level > 1 &&
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

              {state.districts.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          }
          &nbsp;&nbsp;
          {level > 2 &&
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

              {state.ps.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          }
        </Box>
      </Box>
    </Box>
  );
};

export default LevelSelector;

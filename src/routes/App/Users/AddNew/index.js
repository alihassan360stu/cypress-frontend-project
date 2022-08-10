import React, { useEffect, useState } from 'react';
import { Grid, Box, Button, CircularProgress, Backdrop } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import BasicForm from './BasicForm';
import validator from 'validator'
import PermissionsSelect from './PermissionsSelect';
import PoliceHeirarchySelect from './PoliceHeirarchySelect';

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
  noRoleTitle: {
    color: theme.palette.warning.dark,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '2px 2px 2px hsla(0,10%,85.9%,.8)',
  }
}));

const initalFormState = {
  username: '',
  full_name: '',
  password: '',
  contact: '',
  role_id: -1,
  roles: [],
  is_loading: false
}

const initalLevelState = {
  rangeZoneId: -1,
  ps_id: -1,
  range_id: -1,
  region_id: -1,
  zone_id: -1,
  district_id: -1,

  rangeZones: [],
  regions: [],
  districts: [],
  ps: [],

  is_loading: false
}

const initalPermissionsState = {
  cro: true,
  psrms: true,
  hotel_eye: true,
  hr: true,
  dl: true,

  tenant: true,
  ctag: true,
  cfms: true,
  cri: true,
  one_to_one: true,
  fir_copy: true,

  aclc: true,
  excise: true,
  cro_facial: true,
  subscriber: true,
  tasdeeq: true,
  save_log: true,
  hidden: false,
  verisys: false,
  verisys_limit_per_day: 100,
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

const validationErrors = {
  username: 'Invalid Username',
  full_name: 'Invalid Full Name',
  email: 'Invalid Email',
  cnic: 'Invalid CNIC Number It Should Be 13 Digit Number Without Dashes',
  password: 'Invalid Password, Password Must Contain A Digit A Small And Capital Word An Special Character And ',
  contact: 'Invalid Contact Number',
  role_id: 'Invalid Role Selected'
};


const AddCompany = () => {

  const classes = useStyles();

  const [formState, setFormState] = useState(initalFormState);
  const [permissionsState, setPermissionsState] = useState(initalPermissionsState);
  const [levelState, setLevelState] = React.useState(initalLevelState);

  const [formType, setFormType] = useState('Nothing');
  const [isFormSubmitable, setIsFormSubmitable] = useState(false);

  const { authUser } = useSelector(({ auth }) => auth);

  const handleOnChangeTF = (e) => {
    var { name, value } = e.target;
    e.preventDefault();
    setFormState(prevState => ({ ...prevState, [name]: value }));
    if (name === 'role_id') {
      handleRoleChange(value)
    }
  }

  const handleRoleChange = (role_id) => {
    if (Number(role_id) !== -1) {
      const { roles } = formState
      var roleName = '';
      roles.forEach(role => {
        if (role._id === role_id) {
          roleName = role.title
        }
      });

      if (roleName === 'Monitor') {
        setFormType('Nothing')
        setIsFormSubmitable(false)
        showMessage('error', 'This Role Is Under Development')
      } else {
        const { rangeZones, regions } = levelState
        setLevelState({ ...initalLevelState, rangeZones, regions })
        setFormType(roleName)
        setIsFormSubmitable(true)
      }

    } else {
      setFormType('Nothing')
      setIsFormSubmitable(false)
    }
  }

  const showMessage = (icon, text) => {
    Toast.fire({
      icon,
      title: text
    });
  }

  const validate = () => {
    if (!isFormSubmitable) {
      showMessage('error', 'Invalid Role Selected Please Select An Availabel Role Then Continue');
      return false;
    }

    var { username, full_name, password, contact, role_id } = formState
    if (!role_id) {
      showMessage('error', 'Please Select A Role To Continue');
      return false;
    }

    var values = { username, full_name, password, contact }
    for (let key in values) {
      if (validator.isEmpty(values[key])) {
        showMessage('error', validationErrors[key]);
        return false;
      }
    }

    if (!validator.isStrongPassword(password, {
      minLength: 8, minLowercase: 1,
      minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
      showMessage('error', 'Password Must Include 1 Lower Case, 1 Upper Case, 1 Number And 1 Symbol And Min Length Is 8');
      return false;
    }

    let { region_id, rangeZoneId, rangeZones, range_id, zone_id, district_id, ps_id } = levelState
    if (rangeZones.length > 0) {
      var rzType = null;

      rangeZones.forEach(rz => {
        if (rz.id === rangeZoneId) {
          rzType = rz.type;
        }
      })

      if (rzType) {
        if (rzType === 'range') {
          range_id = rangeZoneId;
        } else {
          zone_id = rangeZoneId;
        }
      }
    }

    switch (formType) {
      case 'Region':
        if (
          !region_id || Number(region_id) < 1
        ) {
          showMessage('error', 'Please Select Range To Continue');
          return false;
        }
        break;
      case 'Range':
        if (
          !range_id || Number(range_id) < 1
        ) {
          showMessage('error', 'Please Select Range To Continue');
          return false;
        }
        break;
      case 'Zone':
        if (
          !zone_id || Number(zone_id) < 1
        ) {
          showMessage('error', 'Please Select Zone To Continue');
          return false;
        }
        break;
      case 'District':
        if (
          !district_id || Number(district_id) < 1
        ) {
          showMessage('error', 'Please Select District To Continue');
          return false;
        }
        break;
      case 'Police Station':
        if (
          !ps_id || Number(ps_id) < 1
        ) {
          showMessage('error', 'Please Select Police Station To Continue');
          return false;
        }
        break;
      case 'Cypress': {
        let { verisys, verisys_limit_per_day } = permissionsState
        if (
          (!range_id || Number(range_id) < 1) &&
          (!zone_id || Number(zone_id) < 1)
        ) {
          showMessage('error', 'Please Atleast Select Range Or Zone To Continue');
          return false;
        }
        if (verisys && Number(verisys_limit_per_day) < 1) {
          showMessage('error', 'If Verisys Is Allowed So Limit Cannot Be Less Than 1');
          return false;
        }
        break;
      }
      default:
        break;
    }

    return true;
  }

  const submitRequest = (data) => {
    try {
      Axios.post('/auth/create-user', data).then(result => {
        result = result.data;;
        if (result.status) {
          showMessage('success', result.message);
          setTimeout(() => {
            setFormState({ ...initalFormState, roles: formState.roles })
            setPermissionsState(initalPermissionsState)
            setIsFormSubmitable(false)
            setFormType('Nothing');

          }, 1000);
        } else {
          showMessage('error', result.message);
          setFormState(prevState => ({ ...prevState, is_loading: false }));
        }
      }).catch(e => {
        setFormState(prevState => ({ ...prevState, is_loading: false }));
        showMessage('error', e);
      })
    } catch (e) {
      showMessage('error', e);
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      MySwal.fire({
        title: 'Are you sure?',
        text: "Please Ensure All Information Is Correct Then Continue",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Agreed, Plaese Continue !',
        cancelButtonText: 'No, cancel !',
        reverseButtons: true,
      }).then(async result => {
        if (result.value) {
          try {
            setFormState(prevState => ({ ...prevState, is_loading: true }))
            var { username, full_name, password, contact, role_id } = formState
            var { region_id, rangeZoneId, ps_id, range_id, zone_id, district_id, rangeZones } = levelState

            if (rangeZones.length > 0) {
              var rzType = null;

              rangeZones.forEach(rz => {
                if (rz.id === rangeZoneId) {
                  rzType = rz.type;
                }
              })

              if (rzType) {
                if (rzType === 'range') {
                  range_id = rangeZoneId;
                } else {
                  zone_id = rangeZoneId;
                }
              }
            }

            let dataToSubmit = {
              username, full_name, password, contact, role_id,
              range_id: range_id ? Number(range_id) !== -1 ? range_id : null : null,
              zone_id: zone_id ? Number(zone_id) !== -1 ? zone_id : null : null,
              region_id: region_id ? Number(region_id) !== -1 ? region_id : null : null,
              ps_id: ps_id ? Number(ps_id) !== -1 ? ps_id : null : null,
              district_id: district_id ? Number(district_id) !== -1 ? district_id : null : null,
            };

            if (formType === 'Cypress')
              dataToSubmit.permissions = JSON.stringify(permissionsState);

            submitRequest(dataToSubmit)
          } catch (e) {
            MySwal.fire('Error', e, 'error');
          }
        }
      });
    }
  }

  const handlePermissionChange = event => {
    try {
      var { name, value, checked } = event.target
      if (name === 'verisys_limit_per_day') {
        setPermissionsState(prevState => ({ ...prevState, [name]: value }));
      } else {
        setPermissionsState(prevState => ({ ...prevState, [name]: checked }));
      }
    } catch (e) {

    }
  };

  const getForm = () => {
    var elemment = '';
    switch (formType) {
      case 'Nothing':
        return (
          <Box display={'flex'} justifyContent={'center'} className={classes.noRoleTitle} fontSize={{ xs: 20, sm: 20 }}>
            No Role Selected, Please Select A Valid Role To Continue
          </Box>
        )
      case 'Region':
        return (
          <Box display={'flex'} justifyContent={'center'} className={classes.noRoleTitle} fontSize={{ xs: 20, sm: 20 }}>
            <PoliceHeirarchySelect state={levelState} setState={setLevelState} level={0} />
          </Box>
        )
      case 'Range':
        return (
          <Box display={'flex'} justifyContent={'center'} className={classes.noRoleTitle} fontSize={{ xs: 20, sm: 20 }}>
            <PoliceHeirarchySelect state={levelState} setState={setLevelState} level={1} />
          </Box>
        )
      case 'Zone':
        return (
          <Box display={'flex'} justifyContent={'center'} className={classes.noRoleTitle} fontSize={{ xs: 20, sm: 20 }}>
            <PoliceHeirarchySelect state={levelState} setState={setLevelState} level={1} />
          </Box>
        )
      case 'District':
        return (
          <Box display={'flex'} justifyContent={'center'} className={classes.noRoleTitle} fontSize={{ xs: 20, sm: 20 }}>
            <PoliceHeirarchySelect state={levelState} setState={setLevelState} level={2} />
          </Box>
        )
      case 'Police Station':
        return (
          <Box display={'flex'} justifyContent={'center'} className={classes.noRoleTitle} fontSize={{ xs: 20, sm: 20 }}>
            <PoliceHeirarchySelect state={levelState} setState={setLevelState} level={3} />
          </Box>
        )
      case 'Administrator':
        return (
          <Box display={'flex'} justifyContent={'center'} className={classes.noRoleTitle} fontSize={{ xs: 20, sm: 20 }}>
            Administrator Role Selected
          </Box>
        )
      case 'Cypress':
        return (
          <div>
            <Box display={'flex'} justifyContent={'center'} className={classes.noRoleTitle} fontSize={{ xs: 20, sm: 20 }}>
              <PoliceHeirarchySelect state={levelState} setState={setLevelState} level={3} />
            </Box>
            <Box display={'flex'} justifyContent={'center'} className={classes.noRoleTitle} fontSize={{ xs: 20, sm: 20 }}>
              <PermissionsSelect state={permissionsState} handleChange={handlePermissionChange} />
            </Box>
          </div>
        )
      default: {
        setIsFormSubmitable(false);
        return (
          <Box display={'flex'} justifyContent={'center'} className={classes.noRoleTitle} fontSize={{ xs: 20, sm: 20 }}>
            Please Select A Valid Role To Continue
          </Box>
        )
      }
    }
    return (
      <div>
        <PermissionsSelect state={permissionsState} handleChange={handlePermissionChange} />
        <br />
        {elemment}
      </div>
    )
  }

  // const handleSelect = (name, value) => {
  //   setState(prevState => ({ ...prevState, [name]: value }));
  // }
  const getRoles = async () => {
    try {
      Axios.post(authUser.api_url + '/get-user-roles').then(ans => {
        if (ans.data.status) {
          setFormState(prevState => ({ ...prevState, roles: ans.data.data }))
        } else {
          showMessage('error', ans.data.message)
        }
      }).catch(e => {
        showMessage('error', e)
      })
    } catch (e) {

    }
  }

  const getRangeZones = () => {
    Axios.post(authUser.api_url + '/get-range-zone').then(ans => {
      if (ans.data.status)
        setLevelState(prevState => ({ ...prevState, rangeZones: ans.data.data }))
      else
        showMessage('error', ans.data.message)
    }).catch(e => {
      showMessage('error', e)
    })
  }

  const getRegions = () => {
    Axios.post(authUser.api_url + '/get-regions').then(ans => {
      if (ans.data.status)
        setLevelState(prevState => ({ ...prevState, regions: ans.data.data }))
      else
        showMessage('error', ans.data.message)
    }).catch(e => {
      showMessage('error', e)
    })
  }

  useEffect(() => {
    getRoles()
    getRegions()
    getRangeZones()
  }, [])


  return (
    <PageContainer heading="" id='myTest'>
      <GridContainer>
        <Grid item xs={12}>
          <div>
            <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
              Create New User
            </Box>
          </div>
          <Divider />
          <br />
          <Box className={classes.root} mt={20}>
            <form autoComplete="off" onSubmit={onSubmit}>
              <Box mb={2}>
                <BasicForm state={formState} handleOnChangeTF={handleOnChangeTF} />
                <br />
                {getForm()}
                <br />
                <br />
                <Divider />
                <Button style={{ marginTop: 10 }} type='submit' variant="contained" color="primary" disabled={formState.is_loading}>
                  Create
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
      </GridContainer>
      <Backdrop className={classes.backdrop} open={formState.is_loading}>
        <CircularProgress color="secondary" />
      </Backdrop>
    </PageContainer>
  );
};

export default AddCompany;

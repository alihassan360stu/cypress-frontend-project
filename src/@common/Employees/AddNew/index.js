import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Grid, Box, Button, CircularProgress, Backdrop } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import GridContainer from '@jumbo/components/GridContainer';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import BasicForm from './BasicForm';
import WitnessForm from './WitnessForm';
import BiometricForm from './BiometricForm';
import AppearanceForm from './AppearanceForm';
import axios from 'axios';
import validator from 'validator';
const FormData = require('form-data');

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
    },
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
}));

const initialPInfoState = {
  name: '',
  father_name: '',
  cnic: '',
  // cnic: '4410334109773',
  // cnic: '4410380422539',
  contact: '',
  other_contact: '',
  perm_address: '',
  temp_address: '',
  designation: '',
  emp_code: '',
  emp_type_id: 3,
  gender: 1,
  adult: 1
};

const initialWitnessState = {
  wit1_name: '',
  wit1_father_name: '',
  wit1_cnic: '',
  wit1_contact: '',

  wit2_name: '',
  wit2_father_name: '',
  wit2_cnic: '',
  wit2_contact: '',
};

const initialWintessAvailableState = {
  is_first_witness_available: false,
  is_second_witness_available: false,
};

const initial121State = {
  wsq_base64: '',
  bmp_base64: '',
  template: '',
  is_verified: false,
  verified_cnic: ''
};

const initialAppearanceState = {
  profile_image: {
    img_base64: null,
    img: null,
  },
  left_thumb: {
    wsq_base64: null,
    bmp_base64: null,
    template_base64: null,
    finger_number: 6,

    img_wsq: null,
    img_bmp: null,
    img_quality: -1,
    img_str: ''
  },
  left_index: {
    wsq_base64: null,
    bmp_base64: null,
    template_base64: null,
    finger_number: 7,

    img_wsq: null,
    img_bmp: null,
    img_quality: -1,
    img_str: ''
  },
  right_thumb: {
    wsq_base64: null,
    bmp_base64: null,
    template_base64: null,
    finger_number: 1,

    img_wsq: null,
    img_bmp: null,
    img_quality: -1,
    img_str: ''
  },
  right_index: {
    wsq_base64: null,
    bmp_base64: null,
    template_base64: null,
    finger_number: 2,

    img_wsq: null,
    img_bmp: null,

    img_quality: -1,
    img_str: ''
  },
};

const Toast = MySwal.mixin({
  target: '#myTest',
  customClass: {
    container: {
      position: 'absolute',
      zIndex: 999999999,
    },
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
  name: 'Invalid Name',
  father_name: 'Invalid Father Name',
  cnic: 'Invalid CNIC Number It Should Be 13 Digit Number Without Dashes',
  contact: 'Invalid Contact Number',
  other_contact: 'Invalid Other Contact Number',
  temp_address: 'Invalid Temporary Address',
  perm_address: 'Invalid Permanent Address',
  designation: 'Invalid Employee Designation',

  wit1_name: 'Invalid First Reference Name',
  wit1_father_name: 'Invalid First Reference Father Name',
  wit1_cnic: 'Invalid First Reference CNIC Number It Should Be 13 Digit Number Without Dashes',
  wit1_contact: 'Invalid First Reference Contact Number',

  wit2_name: 'Invalid Second Reference Name',
  wit2_father_name: 'Invalid Second Reference Father Name',
  wit2_cnic: 'Invalid Second Reference CNIC Number It Should Be 13 Digit Number Without Dashes',
  wit2_contact: 'Invalid Second Reference Contact Number',
};

const AddCompany = () => {
  const classes = useStyles();

  const { authUser } = useSelector(({ auth }) => auth);
  const { permissions } = useSelector(permissions => permissions);
  const [pInfoState, setPInfoState] = useState(initialPInfoState);
  const [witInfoState, setWitInfoState] = useState(initialWitnessState);
  const [witAvailableState, setWitAvailableState] = useState(initialWintessAvailableState);
  const [OneToOneState, setOneToOneState] = useState(initial121State);
  const [appearanceState, setAppearanceState] = useState(initialAppearanceState);

  const [activeStep, setActiveStep] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [skipped, setSkipped] = React.useState(new Set());

  const hanldeOnChangePInfo = e => {
    var { name, value } = e.target;
    e.preventDefault();
    setPInfoState(prevState => ({ ...prevState, [name]: value }));
  };

  const hanldeOnChangeWitness = e => {
    var { name, value } = e.target;
    e.preventDefault();
    setWitInfoState(prevState => ({ ...prevState, [name]: value }));
    // if (name === 'adult') {
    //   if (value === 2) {
    //     //Minor
    //   } else {
    //     //Adult
    //   }
    // }
  };

  const showMessage = (icon, text) => {
    Toast.fire({
      icon,
      title: text,
    });
  };

  const showMessageFull = (icon, text, title) => {
    MySwal.fire(title, text, icon);
  };

  const validate = formName => {
    switch (formName) {
      case 'Personal Information':
        return validatePInfo();
      case 'Biometric Verification':
        return validateBiometric();
      case 'Witnesses':
        return validateWitness();
      case 'Appearance':
        return validateAppearance();
      default:
        showMessage('error', `Invalid Form To Validate`);
        return false;
    }
  };

  const validatePInfo = () => {
    var { name, father_name, cnic, contact, other_contact, perm_address, temp_address, designation } = pInfoState;
    var values = { name, father_name, cnic, contact, other_contact, temp_address, perm_address, designation };
    for (let key in values) {
      if (validator.isEmpty(values[key].trim())) {
        showMessage('error', validationErrors[key]);
        return false;
      }
    }

    if (!validator.isLength(cnic, { max: 13, min: 13 })) {
      showMessage('error', validationErrors.cnic);
      return false;
    }

    return true;
  };

  const validateWitness = () => {
    const {
      wit1_name,
      wit1_father_name,
      wit1_cnic,
      wit1_contact,

      wit2_name,
      wit2_father_name,
      wit2_cnic,
      wit2_contact,
    } = witInfoState;

    var valuesWit1 = {
      wit1_name,
      wit1_father_name,
      wit1_cnic,
      wit1_contact,
    };

    var valuesWit2 = {
      wit2_name,
      wit2_father_name,
      wit2_cnic,
      wit2_contact,
    };
    let isWit1Present = false,
      isWit2Present = false;

    for (let key in valuesWit1) {
      if (!validator.isEmpty(valuesWit1[key].trim())) {
        isWit1Present = true;
        break;
      }
    }

    for (let key in valuesWit2) {
      if (!validator.isEmpty(valuesWit2[key].trim())) {
        isWit2Present = true;
        break;
      }
    }

    if (!isWit1Present && !isWit2Present) {
      showMessage('error', 'Please Add Atleast One Witness');
      return false;
    }

    if (isWit1Present) {
      for (let key in valuesWit1) {
        if (validator.isEmpty(valuesWit1[key].trim())) {
          showMessage('error', validationErrors[key]);
          return false;
        }
      }

      if (!validator.isLength(wit1_cnic, { max: 13, min: 13 })) {
        showMessage('error', validationErrors.wit1_cnic);
        return false;
      }
      setWitAvailableState(prevState => ({ ...prevState, is_first_witness_available: true }));
    } else {
      setWitAvailableState(prevState => ({ ...prevState, is_first_witness_available: false }));
    }

    if (isWit2Present) {
      for (let key in valuesWit2) {
        if (validator.isEmpty(valuesWit2[key].trim())) {
          showMessage('error', validationErrors[key]);
          return false;
        }
      }

      if (!validator.isLength(wit2_cnic, { max: 13, min: 13 })) {
        showMessage('error', validationErrors.wit2_cnic);
        return false;
      }
      setWitAvailableState(prevState => ({ ...prevState, is_second_witness_available: true }));
    } else {
      setWitAvailableState(prevState => ({ ...prevState, is_second_witness_available: false }));
    }
    // if (validator.isEmpty())
    //   showMessage('error', 'TESTING');

    return true;
    // var { name, father_name, cnic, contact, perm_address, temp_address } = pInfoState
    // var values = { name, father_name, cnic, contact, temp_address, perm_address }
    // for (let key in values) {
    //   if (validator.isEmpty(values[key].trim())) {
    //     showMessage('error', validationErrors[key]);
    //     return false;
    //   }
    // }

    // if (!validator.isLength(cnic, { max: 13, min: 13 })) {
    //   showMessage('error', validationErrors.cnic);
    //   return false;
    // }

    // return true;
  };

  const validateBiometric = () => {
    if (!OneToOneState.is_verified) {
      showMessage('error', 'Biometric Verification Failed, Please Do Biometric Verification First To Continue ');
      return false;
    }

    return true;
  };

  const validateAppearance = () => {
    if (appearanceState.profile_image.img == null) {
      showMessage('error', 'Please Upload Or Capture Employee Image First');
      return false;
    }

    if (appearanceState.left_thumb.bmp_base64 == null) {
      showMessage('error', `Please Scan Employee's Left Thumb First`);
      return false;
    }

    if (appearanceState.right_thumb.bmp_base64 == null) {
      showMessage('error', `Please Scan Employee's Right Thumb First`);
      return false;
    }

    if (appearanceState.left_index.bmp_base64 == null) {
      showMessage('error', `Please Scan Employee's Left Index First`);
      return false;
    }

    if (appearanceState.right_index.bmp_base64 == null) {
      showMessage('error', `Please Scan Employee's Right Index First`);
      return false;
    }

    return true;
  };

  const prepareDataToSubmit = () => {
    try {
      const {
        name,
        father_name,
        cnic,
        contact,
        other_contact,
        perm_address,
        temp_address,
        designation,
        emp_code,
        emp_type_id,
        adult,
        gender
      } = pInfoState;
      const {
        wit1_name,
        wit1_father_name,
        wit1_cnic,
        wit1_contact,

        wit2_name,
        wit2_father_name,
        wit2_cnic,
        wit2_contact,
      } = witInfoState;
      const { is_verified } = OneToOneState;
      const { is_first_witness_available, is_second_witness_available } = witAvailableState;
      const { profile_image, left_thumb, left_index, right_thumb, right_index } = appearanceState;

      var formData = new FormData();
      formData.append('name', name);
      formData.append('father_name', father_name);
      formData.append('cnic', cnic);
      formData.append('contact', contact);
      formData.append('other_contact', other_contact);
      formData.append('perm_address', perm_address);
      formData.append('temp_address', temp_address);
      formData.append('designation', designation);
      formData.append('emp_code', emp_code);
      formData.append('emp_type_id', Number(emp_type_id));
      formData.append('gender', Number(gender));
      formData.append('is_adult', Number(adult));

      formData.append('is_first_witness_available', is_first_witness_available ? 1 : 0);
      formData.append('is_second_witness_available', is_second_witness_available ? 1 : 0);
      formData.append('is_biometric_verified', is_verified ? 1 : 0);

      formData.append('wit1_name', wit1_name);
      formData.append('wit1_father_name', wit1_father_name);
      formData.append('wit1_cnic', wit1_cnic);
      formData.append('wit1_contact', wit1_contact);

      formData.append('wit2_name', wit2_name);
      formData.append('wit2_father_name', wit2_father_name);
      formData.append('wit2_cnic', wit2_cnic);
      formData.append('wit2_contact', wit2_contact);

      formData.append('images', profile_image.img, 'profile.png');

      formData.append('images', left_thumb.img_bmp, 'left_thumb.bmp');
      formData.append('images', left_thumb.img_wsq, 'left_thumb.wsq');
      formData.append('lt_template', left_thumb.template_base64);

      formData.append('images', left_index.img_bmp, 'left_index.bmp');
      formData.append('images', left_index.img_wsq, 'left_index.wsq');
      formData.append('li_template', left_index.template_base64);

      formData.append('images', right_thumb.img_bmp, 'right_thumb.bmp');
      formData.append('images', right_thumb.img_wsq, 'right_thumb.wsq');
      formData.append('rt_template', right_thumb.template_base64);

      formData.append('images', right_index.img_bmp, 'right_index.bmp');
      formData.append('images', right_index.img_wsq, 'right_index.wsq');
      formData.append('ri_template', right_index.template_base64);

      return formData;
    } catch (e) {
      throw e;
    }
  };

  const submitRequest = () => {
    try {
      setIsLoading(true);
      axios
        .post(authUser.api_url + '/emp/add', prepareDataToSubmit())
        .then(result => {
          setIsLoading(false);
          result = result.data;
          if (result.status) {
            showMessageFull('success', result.message, 'Employee Registration');
            setTimeout(() => {
              setPInfoState(initialPInfoState);
              setWitInfoState(initialWitnessState);
              setWitAvailableState(initialWintessAvailableState);
              setOneToOneState(initial121State);
              setAppearanceState(initialAppearanceState);
              setActiveStep(0);
            }, 1000);
          } else {
            showMessageFull('error', result.message, 'Employee Registration');
          }
        })
        .catch(e => {
          setIsLoading(false);
          showMessageFull('error', e, 'Employee Registration');
        });
    } catch (e) {
      setIsLoading(false);
      showMessageFull('error', e, 'Employee Registration');
    }
  };

  const getSteps = () => {
    var steps = [];
    steps.push('Personal Information');
    if (permissions.one_to_one && pInfoState.adult === 1) {
      steps.push('Biometric Verification');
    }

    steps.push('Witnesses');
    steps.push('Appearance');

    return steps;
  };

  const steps = getSteps();

  const isStepOptional = step => {
    if (step === 'Witnesses') {
      if (permissions.skip_witness) {
        return true;
      } else {
        return false;
      }
    } else if (step === 'Biometric Verification' && !OneToOneState.is_verified) {
      return true;
    } else {
      return false;
    }
  };

  const isStepSkipped = step => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    if (activeStep === steps.length - 1) {
      if (validate(steps[activeStep])) {
        onSubmit();
      }
      return;
    }

    if (validate(steps[activeStep])) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSkip = () => {
    var stepToSkip = steps[activeStep];
    if (!isStepOptional(stepToSkip)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    if (stepToSkip === 'Biometric Verification') {
      setOneToOneState(prevState => ({ ...prevState, is_verified: false }));
    }
    if (stepToSkip === 'Witnesses') {
      setWitAvailableState(prevState => ({
        ...prevState,
        is_first_witness_available: false,
        is_second_witness_available: false,
      }));
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const getStepContent = step => {
    switch (step) {
      case 'Personal Information':
        return <BasicForm state={pInfoState} handleOnChangeTF={hanldeOnChangePInfo} />;
      case 'Biometric Verification':
        return <BiometricForm cnic={pInfoState.cnic} OneToOneState={OneToOneState} setOneToOneState={setOneToOneState} />;
      case 'Witnesses':
        return <WitnessForm state={witInfoState} handleOnChangeTF={hanldeOnChangeWitness} />;
      case 'Appearance':
        return <AppearanceForm appearanceState={appearanceState} setAppearanceState={setAppearanceState} />;
      default:
        return 'Unknown step';
    }
  };

  const onSubmit = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'Please Ensure All Information Is Correct Then Continue',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Agreed, Plaese Continue !',
      cancelButtonText: 'No, cancel !',
      reverseButtons: true,
    }).then(async result => {
      if (result.value) {
        try {
          submitRequest();
        } catch (e) {
          MySwal.fire('Error', e, 'error');
        }
      }
    });
  };

  return (
    <PageContainer heading="" id="myTest">
      <GridContainer>
        <Grid item xs={12}>
          <div>
            <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
              Verify New Employee
            </Box>
          </div>
          <Divider />
          <br />
          <Box className={classes.root}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <Box>
              <Box>
                <form autoComplete="off" onSubmit={onSubmit}>
                  <Box mb={2}>{getStepContent(steps[activeStep])}</Box>
                </form>
                <br />
                <br />
                <Divider />
                <br />
                <Box>
                  <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                    Back
                  </Button>

                  {isStepOptional(steps[activeStep]) && (
                    <Button variant="contained" color="primary" onClick={handleSkip} className={classes.button}>
                      Skip
                    </Button>
                  )}

                  <Button variant="contained" color="primary" onClick={handleNext} className={classes.button}>
                    {activeStep === steps.length - 1 ? 'Register Employee' : 'Next'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </GridContainer>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="secondary" />
      </Backdrop>
    </PageContainer>
  );
};

export default AddCompany;

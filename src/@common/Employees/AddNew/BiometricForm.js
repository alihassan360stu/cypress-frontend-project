import React, { useEffect, useState } from 'react';
import { Box, RadioGroup, FormControlLabel, Radio, Grid, Divider, Button, Typography } from '@material-ui/core';
import { makeStyles, alpha } from '@material-ui/core/styles';
import GridContainer from '@jumbo/components/GridContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import { green, red, orange } from '@material-ui/core/colors';

const MySwal = withReactContent(Swal);

const useStyles = makeStyles(theme => ({
  textFieldRoot: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.common.dark, 0.12),
    },
  },
  pageTitle: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    // textShadow: '6px 4px 6px hsla(0,0%,45.9%,.8)',
  },

  verifiedTitle: {
    color: green[700],
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '10px 4px 10px hsla(0,0%,45.9%,.8)',
  },
}));

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

// [false,"auto",true,1,2,3,4,5,6,7,8,9,10,11,12]
const xs = 'auto';
const sm = 'auto';
const xl = 'auto';

const initialImgQuality = {
  quality: -1,
  str: ''
};

const BasicForm = ({ cnic, OneToOneState, setOneToOneState }) => {
  const [fingerNumber, setFingerNumber] = useState('1');
  const [imgQuality, setImgQuality] = useState(initialImgQuality);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadyForVerif, setIsReadyForVerif] = useState(false);

  useEffect(() => {
    if (String(OneToOneState.verified_cnic) === String(cnic)) {
      setOneToOneState(prevState => ({ ...prevState, is_verified: true }));
    } else {
      setOneToOneState(prevState => ({ ...prevState, is_verified: false }));
    }
  }, []);

  const classes = useStyles();

  const getImgQuality = () => {
    switch (imgQuality.quality) {
      case 1 | 2:
        return <Typography variant='caption' >Fingerprint Quality <b style={{ color: green[500] }}> "{imgQuality.str}" </b> </Typography>
      case 3:
        return <Typography variant='caption' >Fingerprint Quality <b style={{ color: orange[300] }}> "{imgQuality.str}" </b> </Typography>
      case 4:
        return <Typography variant='caption' >Fingerprint Quality <b style={{ color: orange[500] }}> "{imgQuality.str}" </b> </Typography>
      case 5:
        return <Typography variant='caption' >Fingerprint Quality <b style={{ color: red[500] }}> "{imgQuality.str}" </b> </Typography>
      default:
        return ('');
    }
  }

  const handleChange = event => {
    event.preventDefault();
    setFingerNumber(event.currentTarget.value);
  };

  const showMessage = (icon, text) => {
    Toast.fire({
      icon,
      title: text,
    });
  };

  const scanFingerRequest = e => {
    try {
      e.preventDefault();
      if (OneToOneState.is_verified) {
        showMessage('success', 'Already Verified');
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = false;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          xhr.onerror = function (e) {
            setIsLoading(false);
            showMessage('error', "Unknown Error Occured. Server response not received.");
            return;
          };
          xhr.onload = async e => {
            setIsLoading(false);
            try {
              var result = JSON.parse(this.responseText);
              if (result.status) {
                setIsReadyForVerif(true);
                showMessage('success', result.message);
                result = result.data;
                setImgQuality({ quality: result.img_score, str: result.img_quality })
                setOneToOneState({
                  wsq_base64: result.wsq,
                  bmp_base64: result.bmp,
                  template: result.template
                });
              } else {
                setIsReadyForVerif(false);
                showMessage('error', result.message);
              }
            } catch (error) {
              setIsReadyForVerif(false);
              showMessage('error', error);
            }
          }
        }
      });

      xhr.open("POST", "http://localhost:9991/ScanFinger");

      setIsLoading(true);
      xhr.send();
    } catch (err) {
      setIsLoading(false);
      showMessage('error', err);
      setIsReadyForVerif(false);
    }
  };

  const requestVerification = e => {
    try {
      e.preventDefault();
      if (OneToOneState.is_verified) {
        showMessage('success', 'Already Verified');
        return;
      }
      if (!isReadyForVerif) return;

      setIsLoading(true);
      Axios.post('client/121', {
        cnic,
        finger_number: fingerNumber,
        fingerprint: OneToOneState.template,
      }).then(result => {
        setIsLoading(false);
        result = result.data;
        if (result.status !== undefined && !Boolean(result.status)) {
          showMessage('error', result.message);
          setOneToOneState(prevState => ({ ...prevState, is_verified: false }));
        } else {
          result = result.data;
          if (Number(result.return_code) === 1) {
            showMessage('success', 'Biometric Verification Successfull');
            setOneToOneState(prevState => ({ ...prevState, is_verified: true, verified_cnic: cnic }));
          } else {
            setOneToOneState(prevState => ({ ...prevState, is_verified: false }));
            showMessage('error', `Biometric Verification Failed (${result.remarks})`);
          }
        }
      }).catch(e => {
        setOneToOneState(prevState => ({ ...prevState, is_verified: false }));
        setIsLoading(false);
        showMessage('error', e);
      });
    } catch (err) {
      setOneToOneState(prevState => ({ ...prevState, is_verified: false }));
      setIsLoading(false);
      showMessage('error', err);
    }
  };

  return (
    <div>
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
        <Divider style={{ width: '100%' }} />
        <br />
        <h4>CNIC NUMBER </h4>
        <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
          {cnic}
        </Box>

        {OneToOneState.is_verified && (
          <div>
            <br />
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
              <Box className={classes.verifiedTitle} fontSize={{ xs: 30, sm: 30 }}>
                Biometric Verification Completed
              </Box>
            </Box>
          </div>
        )}

        {!OneToOneState.is_verified && (
          <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <img src={isReadyForVerif ? `data:image/bmp;base64, ${OneToOneState.bmp_base64}` : '/images/bio.gif'} alt="" />
            {getImgQuality()}
            <Divider style={{ width: '100%' }} />
            <br />
            <h4>Select Finger Number </h4>
            <br />
            <RadioGroup value={fingerNumber} onChange={handleChange}>
              <GridContainer>
                <Grid item xs={xs} sm={sm} xl={xl}>
                  <FormControlLabel value={'1'} control={<Radio />} label="Right Thumb" />
                </Grid>
                <Grid item xs={xs} sm={sm} xl={xl}>
                  <FormControlLabel value={'2'} control={<Radio />} label="Right Index" />
                </Grid>
                <Grid item xs={xs} sm={sm} xl={xl}>
                  <FormControlLabel value={'6'} control={<Radio />} label="Left Thumb" />
                </Grid>
                <Grid item xs={xs} sm={sm} xl={xl}>
                  <FormControlLabel value={'7'} control={<Radio />} label="Left Index" />
                </Grid>
              </GridContainer>
            </RadioGroup>

            <br />
            <Divider style={{ width: '100%' }} />
            <br />

            <Box>
              <GridContainer>
                <Grid item xs={xs} sm={sm} xl={xl}>
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={isLoading || OneToOneState.is_verified}
                    onClick={scanFingerRequest}>
                    Scan Fingerprint
                  </Button>
                </Grid>
                <Grid item xs={xs} sm={sm} xl={xl}>
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={isLoading || !isReadyForVerif || OneToOneState.is_verified}
                    onClick={requestVerification}>
                    Request Verification
                  </Button>
                </Grid>
              </GridContainer>
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default BasicForm;

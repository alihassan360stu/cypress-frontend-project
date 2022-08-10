import React, { createRef, useState } from 'react';
import {
  Box,
  Popover,
  Paper,
  MenuList,
  MenuItem,
  IconButton,
  AppBar,
  Dialog,
  Toolbar,
  Typography,
  Divider,
  Grid,
  Button,
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import { makeStyles, alpha } from '@material-ui/core/styles';
import CmtAvatar from '@coremat/CmtAvatar';
import { PhotoCamera, CloudUpload, Close } from '@material-ui/icons';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Camera, { IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import Slide from '@material-ui/core/Slide';
import GridContainer from '@jumbo/components/GridContainer';
import { green, red, orange } from '@material-ui/core/colors';

const MySwal = withReactContent(Swal);

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  avatar: {
    boxShadow: '4px 4px 16px hsla(0,0%,45.9%,.8)',
    borderRadius: '50%',
  },
  finger: {
    width: 200,
    height: 200,
  },
  finger_scanned: {
    width: 200,
    height: 250,
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

const xs = 'auto';
const sm = 'auto';
const xl = 'auto';

function srcToFile(src, fileName, mimeType) {
  return fetch(src)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], fileName, { type: mimeType });
    });
}

const AppearanceForm = ({ appearanceState, setAppearanceState }) => {
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const fileInputRef = createRef(null);

  const { getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDropAccepted: (acceptedFiles, rejectedFiles, event) => {
      var file = acceptedFiles[0];
      setAppearanceState(prevState => ({
        ...prevState,
        profile_image: { img_base64: URL.createObjectURL(file), img: file },
      }));
    },
    onDropRejected: (acceptedFiles, rejectedFiles, event) => {
      try {
        setAppearanceState(prevState => ({ ...prevState, profile_image: { img_base64: null, img: null } }));
        var err = acceptedFiles[0].errors[0];
        if (err.code === 'file-too-large') {
          showMessage('error', 'Image Size Is More Than 2 Mb');
        }
        if (err.code === 'file-invalid-type') {
          showMessage('error', 'Invalid Image Type');
        }
      } catch (e) {
        showMessage('error', e);
      }
    },
    maxSize: 2097152,
  });

  const getImgQuality = ({ img_quality, img_str }) => {
    switch (img_quality) {
      case -1:
        return ('');
      case 1:
      case 2:
        return <Typography variant='caption' >Fingerprint Quality <b style={{ color: green[500] }}> "{img_str}" </b> </Typography>
      case 3:
        return <Typography variant='caption' >Fingerprint Quality <b style={{ color: orange[300] }}> "{img_str}" </b> </Typography>
      case 4:
        return <Typography variant='caption' >Fingerprint Quality <b style={{ color: orange[500] }}> "{img_str}" </b> </Typography>
      case 5:
        return <Typography variant='caption' >Fingerprint Quality <b style={{ color: red[500] }}> "{img_str}" </b> </Typography>
      default:
        return <Typography variant='caption' >Fingerprint Quality <b style={{ color: red[500] }}> "BAD IMAGE" </b> </Typography>
    }
  }

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const showMessage = (icon, text) => {
    Toast.fire({
      icon,
      title: text,
    });
  };

  const scanFingerRequest = e => {
    try {
      e.preventDefault();
      var { name } = e.currentTarget;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = false;

      xhr.addEventListener("readystatechange", async function () {
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
                let message = result.message;
                result = result.data;
                var img_bmp = await srcToFile(`data:image/bmp;base64, ${result.bmp}`, 'img_bmp.bmp', 'image/bmp');
                var img_wsq = await srcToFile(
                  `data:application/octet-stream;base64, ${result.wsq}`,
                  'img_wsq.wsq',
                  'application/octet-stream',
                );
                showMessage('success', message);
                setAppearanceState(prevState => ({
                  ...prevState,
                  [name]: {
                    wsq_base64: result.wsq,
                    bmp_base64: result.bmp,
                    img_bmp,
                    template_base64: result.template,
                    img_wsq,
                    img_quality: result.img_score,
                    img_str: result.img_quality
                  },
                }));
              } else {
                showMessage('error', result.message);
              }
            } catch (error) {
              showMessage('error', 'error');
            }
          }
        }
      });

      xhr.open("POST", "http://localhost:9991/ScanFinger");

      setIsLoading(true);
      xhr.send();
    } catch (e) {
      setIsLoading(false);
      showMessage('error', e);
    }
  };

  const handleResetFinger = e => {
    try {
      e.preventDefault();
      var { name } = e.currentTarget;
      setAppearanceState(prevState => ({ ...prevState, [name]: { wsq_base64: null, bmp_base64: null } }));
    } catch (e) {
      showMessage('error', e);
    }
  };

  const handleUploadFromDevice = e => {
    e.preventDefault();
    handlePopoverClose();
    try {
      fileInputRef.current.click();
    } catch (e) {
      showMessage('error', e);
    }
  };

  const handleCameraClick = e => {
    e.preventDefault();
    handlePopoverClose();
    handleDialogOpen();
  };

  const handleTakePhoto = dataUri => {
    try {
      handleDialogClose();
      srcToFile(dataUri, 'profile.png', 'image/png').then(function (img) {
        setAppearanceState(prevState => ({ ...prevState, profile_image: { img_base64: dataUri, img } }));
      });
    } catch (e) {
      showMessage('error', e);
    }
  };

  return (
    <div>
      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'}>
        <Box className={classes.avatar}>
          <CmtAvatar
            color="random"
            size={150}
            variant="circular"
            alt="avatar"
            src={appearanceState.profile_image.img_base64 ? appearanceState.profile_image.img_base64 : `/images/default.jpg`}
            onClick={handlePopoverOpen}
          />
        </Box>
        <br />
        <input {...getInputProps()} hidden ref={fileInputRef} />

        <h3> Employee Image</h3>
        <h5>*Click Image To Change. Image Shouldn't Be More Than 2 Mb </h5>
        <br />
        <br />
        <Box display={'flex'} flexDirection={'row'} width={'100%'}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            <img
              src={
                appearanceState.left_thumb.bmp_base64
                  ? `data:image/bmp;base64, ${appearanceState.left_thumb.bmp_base64}`
                  : '/images/bio.gif'
              }
              alt=""
              className={appearanceState.left_thumb.bmp_base64 ? classes.finger_scanned : classes.finger}
            />
            {getImgQuality(appearanceState.left_thumb)}
            <Divider style={{ width: '100%' }} />
            <br />
            <h3> Left Thumb </h3>
            <br />
            <GridContainer style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
              <Grid item xs={xs} sm={sm} xl={xl}>
                <Button
                  variant="outlined"
                  color="primary"
                  name="left_thumb"
                  disabled={isLoading || appearanceState.left_thumb.bmp_base64 != null}
                  onClick={scanFingerRequest}>
                  Scan
                </Button>
              </Grid>
              <Grid item xs={xs} sm={sm} xl={xl}>
                <Button
                  variant="outlined"
                  color="primary"
                  name="left_thumb"
                  disabled={isLoading || appearanceState.left_thumb.bmp_base64 == null}
                  onClick={handleResetFinger}>
                  Reset
                </Button>
              </Grid>
            </GridContainer>
          </div>
          &nbsp;&nbsp;
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            <img
              src={
                appearanceState.right_thumb.bmp_base64
                  ? `data:image/bmp;base64, ${appearanceState.right_thumb.bmp_base64}`
                  : '/images/bio.gif'
              }
              alt=""
              className={appearanceState.right_thumb.bmp_base64 ? classes.finger_scanned : classes.finger}
            />
            {getImgQuality(appearanceState.right_thumb)}
            <Divider style={{ width: '100%' }} />
            <br />
            <h3> Right Thumb </h3>
            <br />
            <GridContainer style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
              <Grid item xs={xs} sm={sm} xl={xl}>
                <Button
                  variant="outlined"
                  color="primary"
                  name="right_thumb"
                  disabled={isLoading || appearanceState.right_thumb.bmp_base64 != null}
                  onClick={scanFingerRequest}>
                  Scan
                </Button>
              </Grid>
              <Grid item xs={xs} sm={sm} xl={xl}>
                <Button
                  variant="outlined"
                  color="primary"
                  name="right_thumb"
                  disabled={isLoading || appearanceState.right_thumb.bmp_base64 == null}
                  onClick={handleResetFinger}>
                  Reset
                </Button>
              </Grid>
            </GridContainer>
          </div>
        </Box>
        <br />
        <Box display={'flex'} flexDirection={'row'} width={'100%'}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            <img
              src={
                appearanceState.left_index.bmp_base64
                  ? `data:image/bmp;base64, ${appearanceState.left_index.bmp_base64}`
                  : '/images/bio.gif'
              }
              alt=""
              className={appearanceState.left_index.bmp_base64 ? classes.finger_scanned : classes.finger}
            />
            {getImgQuality(appearanceState.left_index)}
            <Divider style={{ width: '100%' }} />
            <br />
            <h3> Left Index </h3>
            <br />
            <GridContainer style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
              <Grid item xs={xs} sm={sm} xl={xl}>
                <Button
                  variant="outlined"
                  color="primary"
                  name="left_index"
                  disabled={isLoading || appearanceState.left_index.bmp_base64 != null}
                  onClick={scanFingerRequest}>
                  Scan
                </Button>
              </Grid>
              <Grid item xs={xs} sm={sm} xl={xl}>
                <Button
                  variant="outlined"
                  color="primary"
                  name="left_index"
                  disabled={isLoading || appearanceState.left_index.bmp_base64 == null}
                  onClick={handleResetFinger}>
                  Reset
                </Button>
              </Grid>
            </GridContainer>
          </div>
          &nbsp;&nbsp;
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            <img
              src={
                appearanceState.right_index.bmp_base64
                  ? `data:image/bmp;base64, ${appearanceState.right_index.bmp_base64}`
                  : '/images/bio.gif'
              }
              alt=""
              className={appearanceState.right_index.bmp_base64 ? classes.finger_scanned : classes.finger}
            />
            {getImgQuality(appearanceState.right_index)}
            <Divider style={{ width: '100%' }} />
            <br />
            <h3> Right Index </h3>
            <br />
            <GridContainer style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
              <Grid item xs={xs} sm={sm} xl={xl}>
                <Button
                  variant="outlined"
                  color="primary"
                  name="right_index"
                  disabled={isLoading || appearanceState.right_index.bmp_base64 != null}
                  onClick={scanFingerRequest}>
                  Scan
                </Button>
              </Grid>
              <Grid item xs={xs} sm={sm} xl={xl}>
                <Button
                  variant="outlined"
                  color="primary"
                  name="right_index"
                  disabled={isLoading || appearanceState.right_index.bmp_base64 == null}
                  onClick={handleResetFinger}>
                  Reset
                </Button>
              </Grid>
            </GridContainer>
          </div>
        </Box>
      </Box>

      {open && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          container={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}>
          <Paper elevation={8}>
            <MenuList>
              <MenuItem onClick={handleCameraClick}>
                <PhotoCamera />
                <div className="ml-2">Take Picture Using Camera</div>
              </MenuItem>
              <MenuItem onClick={handleUploadFromDevice}>
                <CloudUpload />
                <div className="ml-2">Upload From Device</div>
              </MenuItem>
            </MenuList>
          </Paper>
        </Popover>
      )}

      <Dialog fullScreen open={openDialog} onClose={handleDialogClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleDialogClose} aria-label="close">
              <Close />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Take Employee Image
            </Typography>
          </Toolbar>
        </AppBar>
        <Camera
          isFullscreen
          isMaxResolution={true}
          imageType={IMAGE_TYPES.JPG}
          idealFacingMode="environment"
          isImageMirror={false}
          // imageCompression={1}
          // idealResolution={{ width: 800, height: 600 }}
          sizeFactor={0.7}
          onTakePhotoAnimationDone={dataUri => {
            handleTakePhoto(dataUri);
          }}
        />
      </Dialog>
    </div>
  );
};

export default AppearanceForm;

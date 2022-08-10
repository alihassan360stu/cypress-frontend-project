import React from 'react';
import { Box, Typography, Button, Divider, Dialog } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import 'react-notifications/lib/notifications.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import { Constants } from '@services';
import moment from 'moment';
var crypto = require('crypto');

const MySwal = withReactContent(Swal);

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100vh',
    padding: '2%',
    margin: '0 auto',
    minWidth: '100%',
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
  },
  root2: {
    maxWidth: '100vh',
    padding: '5px',
    // margin: '0 auto',
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
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
  pageTitleMain: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '2px 2px 3px hsla(0,0%,45.9%,.8)',
  },
  pageTitle: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    // marginBottom: 20,
    // textShadow: '2px 4px 4px hsla(0,0%,45.9%,.8)',
    width: '100%',
    textAlign: 'left',
  },
  divider: {
    width: '100%',
    minHeight: 1.2,
  },
  pageSubTitle: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    // marginBottom: 20,
    width: '100%',
    textAlign: 'left',
  },
}));

const DetailDialog = props => {
  const classes = useStyles();
  const rowData = props.dialogState.rowData;
  const { authUser } = useSelector(({ auth }) => auth);

  const handleClose = e => {
    e.preventDefault();
    setTimeout(() => {
      props.setDialogState(prevState => ({ ...prevState, show: false }));
    }, 100);
  };

  const handleDetailsClick = e => {
    e.preventDefault();
    setTimeout(() => {
      props.setDialogState(prevState => ({ ...prevState, show: false }));
      if (rowData.emp_history_id) {
        var cipher = crypto.createCipher(Constants.ALGO, Constants.TKV);
        var encrypted = cipher.update(rowData.emp_history_id, 'utf8', 'hex') + cipher.final('hex');
        window.open(window.location.origin + `/app/${authUser.api_url}/emp/` + encrypted, '_blank');
      }
    }, 100);
  };

  return (
    <PageContainer heading="" breadcrumbs={[]}>
      <Dialog
        id="myTest"
        fullWidth={true}
        maxWidth={'sm'}
        open={props.dialogState.show}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <CmtCard>
          <CmtCardContent>
            <div>
              <Box className={classes.pageTitleMain} fontSize={{ xs: 15, sm: 15 }}>
                Notification Details
              </Box>
            </div>
            <Divider />

            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
              width={'100%'}
              className={classes.root}
              mb={2}>
              <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root2}>
                <Typography variant="h5" className={classes.pageSubTitle}>

                  Notification Type
                </Typography>
                <Typography variant="h5" className={classes.pageTitle}>

                  {Constants.NOTI_TYPES[Number(rowData.noti_type) - 1]}
                </Typography>
              </Box>
              <Divider className={classes.divider} />
              <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root2}>
                <Typography variant="h5" className={classes.pageSubTitle}>

                  Date & Time
                </Typography>
                <Typography variant="h5" className={classes.pageTitle}>

                  {moment(rowData.created_at).format('dddd D/MMM/YYYY hh:mm a')}
                </Typography>
              </Box>
              <Divider className={classes.divider} />
              <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root2}>
                <Typography variant="h5" className={classes.pageSubTitle}>

                  Description
                </Typography>
                <Typography variant="h5" className={classes.pageTitle}>

                  {rowData.description}
                </Typography>
              </Box>
              <Divider className={classes.divider} />
              <br />
              <Divider />
              <Box display={'flex'} flexDirection={'column'} alignContent={'center'} width={'100%'} className={classes.root2}>
                <Button
                  style={{ marginTop: 10, marginLeft: 20 }}
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={handleClose}>
                  Ok
                </Button>

                <Button
                  style={{ marginTop: 10, marginLeft: 20 }}
                  type="button"
                  variant="contained"
                  color="primary"
                  hidden={Constants.NOTI_TYPES[Number(rowData.noti_type) - 1] === 'Criminal Notification' ? false : true}
                  onClick={handleDetailsClick}>
                  Details
                </Button>
              </Box>
            </Box>

          </CmtCardContent>
        </CmtCard>
      </Dialog>
    </PageContainer>
  );
};

export default DetailDialog;

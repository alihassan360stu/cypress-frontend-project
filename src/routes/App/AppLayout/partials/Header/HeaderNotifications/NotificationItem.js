import React from 'react';
import { Divider, MenuItem, Typography, Box } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { alpha } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { Constants } from '@services';
import moment from 'moment';
var crypto = require('crypto');

const useStyles = makeStyles(theme => ({
  feedItemRoot: {
    padding: '10px 0',
    position: 'relative',
    borderBottom: `1px solid ${alpha(theme.palette.common.dark, 0.035)}`,
    '& .Cmt-media-object': {
      alignItems: 'center',
    },
    '& .Cmt-media-image': {
      alignSelf: 'flex-start',
      width: 56,
    },
    '& .Cmt-media-body': {
      width: 'calc(100% - 56px)',
      flex: 'inherit',
    },
  },
  titleRoot: {
    letterSpacing: 0.25,
    marginBottom: 6,
    cursor: 'pointer',
  },
}));


const NotificationItem = ({ item, onClosePopOver }) => {
  const classes = useStyles();
  const history = useHistory();
  const { authUser } = useSelector(({ auth }) => auth);

  // const readNotification = (event) => {
  //   try {
  //     Axios.post(authUser.api_url + '/noti/read', { id: item.id }).then(ans => {
  //       onClosePopOver();
  //       history.push('/app/admin/notifications/')
  //     }).catch(e => {
  //       console.log(e)
  //     })
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  const readNotification = (event) => {
    try {
      Axios.post(authUser.api_url + '/noti/read', { id: item.id }).then(ans => {
        onClosePopOver();
        if (Constants.NOTI_TYPES[Number(item.noti_type) - 1] === 'Criminal Notification') {
          if (item.emp_history_id) {
            var cipher = crypto.createCipher(Constants.ALGO, Constants.TKV);
            var encrypted = cipher.update(item.emp_history_id, 'utf8', 'hex') + cipher.final('hex');
            window.open(window.location.origin + `/app/${authUser.api_url}/emp/` + encrypted, '_blank');
          } else {
            history.push(`/app/${authUser.api_url}/notifications`);  
          }
        } else {
          history.push(`/app/${authUser.api_url}/notifications`);
        }
      }).catch(e => {
        console.log(e)
      })
    } catch (e) {
      console.log(e)
    }
  }
  

  return (
    <MenuItem style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 10 }} onClick={readNotification}>
      <Typography color='textPrimary' variant='h4' style={{ width: '100%', textAlign: 'left', color: 'black', fontSize: 14 }}> {Constants.NOTI_TYPES[Number(item.noti_type) - 1]} </Typography>
      <Typography color='textPrimary' variant='subtitle2' style={{ width: '100%', textAlign: 'right', marginTop: 5, fontSize: 10, color: '#B4AEAE' }}> {moment(item.created_at).fromNow(true)} Ago</Typography>
      <Divider style={{ width: '100%' }} />
    </MenuItem>
  );
};

export default NotificationItem;

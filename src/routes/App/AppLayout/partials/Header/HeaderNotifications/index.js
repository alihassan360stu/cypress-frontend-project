import React, { useEffect } from 'react';
import { Box, IconButton, makeStyles, MenuList, Popover, Tooltip, useTheme } from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';
import NotificationsIcon from '@material-ui/icons/Notifications';
import CmtCardHeader from '@coremat/CmtCard/CmtCardHeader';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import CmtCard from '@coremat/CmtCard';

import NotificationItem from './NotificationItem';
import PerfectScrollbar from 'react-perfect-scrollbar';
import clsx from 'clsx';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import { Constants } from '@services';

const useStyles = makeStyles(theme => ({
  cardRoot: {
    '& .Cmt-header-root': {
      paddingTop: 4,
      paddingBottom: 4,
    },
    '& .Cmt-card-content': {
      padding: '0 0 16px !important',
    },
  },
  typography: {
    padding: theme.spacing(2),
  },
  iconRoot: {
    position: 'relative',
    color: alpha(theme.palette.common.white, 0.38),
    '&:hover, &.active': {
      color: theme.palette.common.white,
    },
  },
  counterRoot: {
    color: theme.palette.common.white,
    border: `solid 1px ${theme.palette.common.white}`,
    // backgroundColor: theme.palette.danger.main, 
    backgroundColor: 'red',
    width: 20,
  },
  scrollbarRoot: {
    height: 400,
    padding: 5,
  },
  popoverRoot: {
    '& .MuiPopover-paper': {
      width: 375,
    },
  },
}));

// const headerNotifications = [{ id: 2, description: 'UPDATE NOTIFICATION RECEVIED' }];

const HeaderNotifications = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const { authUser } = useSelector(({ auth }) => auth);
  const theme = useTheme();

  const onOpenPopOver = event => {
    setAnchorEl(event.currentTarget);
    // setCounter(0);
  };

  const onClosePopOver = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const loadNotificaitons = () => {
    try {
      // Axios.post(authUser.api_url + '/noti/getnew', { noti_for: Constants.NOTIFICATION_FOR.ADMIN }).then(ans => {

      //   if (ans.data.status) {
      //     var data = ans.data.data;
      //     setNotifications(data);
      //   }

      //   setTimeout(() => {
      //     loadNotificaitons();
      //   }, Constants.NOTI_REQ_DELAY);

      // }).catch(e => {
      //   setTimeout(() => {
      //     loadNotificaitons();
      //   }, Constants.NOTI_REQ_DELAY);

      // })
    } catch (e) {

    }
  }

  useEffect(() => {
    loadNotificaitons();
  }, [])

  return (
    <Box pr={2}>
      <Tooltip title="Notifications">
        <IconButton
          onClick={onOpenPopOver}
          className={clsx(classes.iconRoot, 'Cmt-appIcon', {
            active: notifications.length > 0,
          })}>
          <Badge badgeContent={notifications.length} classes={{ badge: classes.counterRoot }}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        className={classes.popoverRoot}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onClosePopOver}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        <CmtCard className={classes.cardRoot}>
          <CmtCardHeader
            title="Notifications"
            actionsPos="top-corner"
            separator={{
              color: theme.palette.borderColor.dark,
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          />
          <CmtCardContent>
            {notifications.length > 0 ? (
              <PerfectScrollbar className={classes.scrollbarRoot}>
                <MenuList style={{ width: '100%' }}>
                  {notifications.map((item, index) => {
                    return <NotificationItem key={index} item={item} onClosePopOver={onClosePopOver} />
                  })}
                </MenuList>
              </PerfectScrollbar>
            ) : (
              <Box p={6}>
                <Typography variant="body2">No notifications found</Typography>
              </Box>
            )}
          </CmtCardContent>
        </CmtCard>
      </Popover>
    </Box>
  );
};

export default HeaderNotifications;

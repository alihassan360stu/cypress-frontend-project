import React, { useEffect } from 'react';
import { Box, IconButton, makeStyles, MenuList, MenuItem, Divider, Typography, Popover, Tooltip, useTheme } from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';
import { Apartment } from '@material-ui/icons';
import CmtCardHeader from '@coremat/CmtCard/CmtCardHeader';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import CmtCard from '@coremat/CmtCard';
import PerfectScrollbar from 'react-perfect-scrollbar';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setSelectedOrg } from '@redux/actions';

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
    height: 200,
    padding: 5,
  },
  popoverRoot: {
    '& .MuiPopover-paper': {
      width: 200,
    },
  },
}));

// const headerNotifications = [{ id: 2, description: 'UPDATE NOTIFICATION RECEVIED' }];

const HeaderNotifications = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const orgs = useSelector(({ orgs }) => orgs);
  const org = useSelector(({ org }) => org);
  const theme = useTheme();
  const dispatch = useDispatch();

  const onOpenPopOver = event => {
    setAnchorEl(event.currentTarget);
    // setCounter(0);
  };

  const onClosePopOver = () => {
    setAnchorEl(null);
  };

  const onMenuItemClick = (e) => {
    onClosePopOver();
    try {
      let { item } = e.currentTarget.dataset
      item = JSON.parse(item)
      if (org && org._id === item._id) {
        return;
      }
      dispatch(setSelectedOrg(item))
    } catch (error) {

    }
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Box pr={2}>
      <Tooltip title="Organizations">
        <IconButton
          onClick={onOpenPopOver}
          className={clsx(classes.iconRoot, 'Cmt-appIcon', {
            active: orgs.length > 0,
          })}>
          <Apartment />
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
            title="Organizations"
            actionsPos="top-corner"
            separator={{
              color: theme.palette.borderColor.dark,
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          />
          <CmtCardContent>
            {orgs.length > 0 ? (
              <PerfectScrollbar className={classes.scrollbarRoot}>
                <MenuList style={{ width: '100%' }}>
                  {orgs.map((item, index) => {
                    return <MenuItem style={{ display: 'flex', flexDirection: 'column', alignItems: 'space-between', width: '100%', padding: 0, height: '30px' }} onClick={onMenuItemClick} key={index} data-item={JSON.stringify(item)}>
                      <Typography color='textPrimary' variant='h4' style={{ width: '100%', textAlign: 'left', color: 'black', fontSize: 14 }}> {item.name} </Typography>
                      <div style={{ width: '100%', flex: 1 }}></div>
                      <Divider style={{ width: '100%' }} />
                    </MenuItem>
                  })}

                  {/* {orgs.map((item, index) => {
                    {
                      return <MenuItem style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 10 }} onClick={onMenuItemClick(item)} key={index}>
                        <Typography color='textPrimary' variant='h4' style={{ width: '100%', textAlign: 'left', color: 'black', fontSize: 14 }}> {item.name} </Typography>
                        <Typography color='textPrimary' variant='subtitle2' style={{ width: '100%', textAlign: 'right', marginTop: 5, fontSize: 10, color: '#B4AEAE' }}> {item.description} </Typography>
                        <Divider style={{ width: '100%' }} />
                      </MenuItem>
                    }
                  })} */}
                </MenuList>
              </PerfectScrollbar>
            ) : (
              <Box p={6}>
                <Typography variant="body2">No Organizations </Typography>
              </Box>
            )}
          </CmtCardContent>
        </CmtCard>
      </Popover>
    </Box>
  );
};

export default HeaderNotifications;

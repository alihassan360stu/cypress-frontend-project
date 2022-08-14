import React, { useContext } from 'react';
import { MenuItem, MenuList, Paper, Popover, Typography, Box, Tooltip, IconButton } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { AuhMethods } from '@services/auth';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SidebarThemeContext from '@coremat/CmtLayouts/SidebarThemeContext/SidebarThemeContext';
import { CurrentAuthMethod } from '@jumbo/constants/AppConstants';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '30px 16px 12px 16px',
    borderBottom: props => `solid 1px ${props.sidebarTheme.borderColor}`,
  },
  userInfo: {
    paddingTop: 24,
    transition: 'all 0.1s ease',
    height: 75,
    opacity: 1,
    '.Cmt-miniLayout .Cmt-sidebar-content:not(:hover) &': {
      height: 0,
      paddingTop: 0,
      opacity: 0,
      transition: 'all 0.3s ease',
    },
  },
  userTitle: {
    color: props => props.sidebarTheme.textDarkColor,
    marginBottom: 8,
  },
  userSubTitle: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeightBold,
    letterSpacing: 0.25,
  },
}));

const SidebarHeader = () => {
  const { sidebarTheme } = useContext(SidebarThemeContext);
  const { authUser } = useSelector(({ auth }) => auth);

  const classes = useStyles({ sidebarTheme });
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const onLogoutClick = () => {
    handlePopoverClose();
    dispatch(AuhMethods.basic.onLogout());
  };

  // <IconButton
  //         onClick={onOpenPopOver}
  //         className={clsx(classes.iconRoot, 'Cmt-appIcon', {
  //           active: notifications.length > 0,
  //         })}>
  //         <Badge badgeContent={notifications.length} classes={{ badge: classes.counterRoot }}>
  //           <Apartment />
  //         </Badge>
  //       </IconButton>
  return (
    <Box pr={2}>
      <Tooltip title="Logout">
        <div className={classes.userInfo} onClick={handlePopoverOpen}>
          <div
            className="pointer"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <div className="mr-2">
              <Typography className={classes.userSubTitle}>{authUser.email}</Typography>
            </div>
            <ArrowDropDownIcon />
          </div>
        </div>
      </Tooltip>

      {open && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          container={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}>
          <Paper elevation={8}>
            <MenuList>
              {/* <MenuItem onClick={handlePopoverClose}>
                <PersonIcon />
                <div className="ml-2">Profile</div>
              </MenuItem>
              <MenuItem onClick={handlePopoverClose}>
                <SettingsIcon />
                <div className="ml-2">Settings</div>
              </MenuItem> */}
              <MenuItem onClick={onLogoutClick}>
                <ExitToAppIcon />
                <div className="ml-2">Logout</div>
              </MenuItem>
            </MenuList>
          </Paper>
        </Popover>
      )}

    </Box>
  );
};

export default SidebarHeader;

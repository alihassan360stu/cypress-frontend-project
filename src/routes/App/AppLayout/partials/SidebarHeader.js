import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';
import CmtAvatar from '@coremat/CmtAvatar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import SidebarThemeContext from '@coremat/CmtLayouts/SidebarThemeContext/SidebarThemeContext';

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
  const org = useSelector(({ org }) => org);
  const classes = useStyles({ sidebarTheme });

  return (
    <div className={classes.root}>
      {/* <CmtAvatar src={'https://via.placeholder.com/150'} alt="User Avatar" /> */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <CmtAvatar color="primary" size={75} variant="circular" alt="avatar" src="/images/default.jpg" />

        <div className={classes.userInfo}>
          <div>
            <div className="mr-2" style={{
              display: 'flex',
              width: '100%',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <Typography className={classes.userSubTitle}>{authUser.full_name}</Typography>
            </div>
            {org &&
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <div className="mr-2">
                  <Typography className={classes.userSubTitle}>Selected Orgnaization</Typography>
                </div>
                <div className="mr-2">
                  <Typography className={classes.userSubTitle}>{org.name}</Typography>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      {/* ["amber","brown","orange","purple","primary","red","green","blue","grey","yellow","secondary","random"]. */}


    </div>
  );
};

export default SidebarHeader;

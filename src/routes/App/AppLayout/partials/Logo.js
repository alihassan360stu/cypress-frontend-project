import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import { Box, makeStyles } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import CmtImage from '@coremat/CmtImage';
import GridContainer from '@jumbo/components/GridContainer';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    marginTop: '10%',
  },
  errorNumber: {
    color: theme.palette.warning,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 3,
    marginLeft: 10,
    // textShadow: '8px 4px 6px hsla(0,0%,45.9%,.8)',
    textShadow: '10px 4px 6px hsla(218, 99%, 3%, 1)',
  }
}))

const Logo = ({ color, ...props }) => {
  const classes = useStyles();

  // const logoUrl = color === 'white' ? '/images/logo-white.png' : '/images/logo.png';
  const logoUrl = '/logo_header.png';
  const logoSymbolUrl = '/images/logo_footer.png';
  // const logoSymbolUrl = color === 'white' ? '/images/logo-white-symbol.png' : '/images/logo-symbol.png';
 
  return (
    <Box className="pointer" {...props}>
      <GridContainer justifyContent="center" alignItems="center">
        <Hidden xsDown>
          <NavLink to="/">
            <CmtImage src={logoUrl} alt="logo" style={{height:'40px'}}/>
          </NavLink>
        </Hidden>
        <Hidden smUp>
          <NavLink to="/">
            <CmtImage src={logoUrl} alt="logo" style={{height:'40px'}}/>
          </NavLink>
        </Hidden>
        <Box fontSize={{ xs: 20, sm: 40, }} className={classes.errorNumber}>
          AUTON 8
        </Box>
      </GridContainer>
    </Box>
  );
};

export default Logo;

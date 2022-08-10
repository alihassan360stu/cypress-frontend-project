import React from 'react';
import { Box } from '@material-ui/core';
import CmtImage from '@coremat/CmtImage';

const FooterLogo = ({ color, ...props }) => {
  // const logoUrl = color === 'white' ? '/images/logo-white-symbol.png' : '/images/footer-logo.png';
  const logoUrl = '/logo.png'
  
  return (
    <Box className="pointer" {...props}>
      <a href=""  rel="noopener noreferrer" target="_blank">
        <CmtImage src={logoUrl} alt="logo" style={{height:'40px'}} />
      </a>
    </Box>
  );
};

export default FooterLogo;

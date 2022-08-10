import React from 'react';
import { Divider, Box } from '@material-ui/core';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100vh',
    padding: '2%',
    margin: '0 auto',
    backgroundColor: lighten(theme.palette.background.paper, 0.1),

  },
  titleRoot: {
    marginBottom: 14,
    color: theme.palette.text.primary,
  },
  textFieldRoot: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.common.dark, 0.12),
    }
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  pageTitle: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '6px 4px 6px hsla(0,0%,45.9%,.8)',
  },
  noRoleTitle: {
    color: theme.palette.warning.dark,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '2px 2px 2px hsla(0,10%,85.9%,.8)',
  }
}));

const UnderConstruction = () => {
  const classes = useStyles();

  return (
    <PageContainer heading={`Under Construction`}>
      <Divider />
      <br />
      <Box display={'flex'} justifyContent={'center'} className={classes.pageTitle} fontSize={{ xs: 40, sm: 40 }}>
        This Page Is Under Construction
      </Box>
    </PageContainer>
  );
};

export default UnderConstruction;

import React, { useState } from 'react';
import { Box, Button, CircularProgress, Backdrop, Dialog } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const useStyles = makeStyles(theme => ({
  root: {
    // maxWidth: '100vh',
    // padding: '2%',
    // margin: '0 auto',
    // backgroundColor: lighten(theme.palette.background.paper, 0.1),

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
  }
}));

const View = ({ data }) => {
  // dialogState
  const classes = useStyles();

  return (
    <PageContainer heading="" breadcrumbs={[]} >
      <div className={classes.root}>
        <Box>
          <div style={{ display: 'flex' }}>
            <h4>Test Name </h4>
            &nbsp;&nbsp;
            <h3><b>{data ? data.name : ''}</b></h3>
          </div>
          <div style={{ display: 'flex' }}>
            <h4>Test Description </h4>
            &nbsp;&nbsp;
            <h3><b>{data ? data.description : ''}</b></h3>
          </div>
        </Box>
      </div>
    </PageContainer>
  );
};

export default View;

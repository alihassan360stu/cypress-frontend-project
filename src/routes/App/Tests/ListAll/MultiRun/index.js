import React, { useState } from 'react';
import { Box, Button, Dialog, TextField, MenuItem } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Divider from '@material-ui/core/Divider';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';

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
  }
}));



const EditDialog = ({ showDialog, testRunCall }) => {
  // dialogState
  const classes = useStyles();
  const [browser, setBrowser] = useState('chrome')
  const [type, setType] = useState(1)

  const handleOnChangeTF = (e) => {
    var { value } = e.target;
    e.preventDefault();
    setBrowser(value);
  }

  const browsers = [
    { name: 'Google Chrome', value: 'chrome', id: 1 },
    { name: 'FireFox', value: 'firefox', id: 2 },
    { name: 'Microsoft Edge', value: 'edge', id: 3 },
  ]

  const handleClose = (e) => {
    e.preventDefault();
    setTimeout(() => {
      showDialog(false)
    }, 100);
  }

  return (
    <PageContainer heading="" breadcrumbs={[]}>
      <Dialog
        id='myTest'
        fullWidth={true}
        maxWidth={'md'}
        scroll={'body'}
        open={true}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose(event)
          }
        }}
        aria-labelledby="form-dialog-title">
        <CmtCard mt={20}>
          <CmtCardContent >
            <div>
              <Box className={classes.pageTitle} fontSize={{ xs: 15, sm: 15 }}>
                Run Multiple Tests
              </Box>
            </div>
            <Divider />
            <Box mb={2}>
              <TextField
                id="outlined-select-currency"
                select
                label="Select Browser"
                margin='normal'
                name='browser'
                fullWidth
                value={browser}
                onChange={handleOnChangeTF}
                variant="outlined" >
                {
                  browsers.map(browser => (
                    <MenuItem key={browser.value} value={browser.value}>
                      {browser.name}
                    </MenuItem>
                  ))
                }
              </TextField>
              <TextField
                id="outlined-select-currency"
                select
                label="Select State Type"
                margin='normal'
                name='type'
                fullWidth
                value={type}
                onChange={(e) => {
                  e.preventDefault();
                  let { value } = e.target;
                  setType(value)
                }}

                variant="outlined" >
                <MenuItem key={1} value={1}>
                  Continuous
                </MenuItem>
                <MenuItem key={2} value={2}>
                  Simultaneously
                </MenuItem>
              </TextField>
              <Divider />
              <br />
              <Divider />
              <Button style={{ marginTop: 10 }} type='button' variant="contained" color="primary" onClick={(e) => {
                handleClose(e)
                testRunCall(browser, type)
              }}>
                Start
              </Button>
              <Button style={{ marginTop: 10, marginLeft: 20 }} type='button' variant="contained" color="primary" onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </CmtCardContent>
        </CmtCard>
      </Dialog>
    </PageContainer>
  );
};

export default EditDialog;

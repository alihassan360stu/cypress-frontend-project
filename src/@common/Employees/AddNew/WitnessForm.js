import React from 'react';
import { TextField, Box, Divider } from '@material-ui/core';
import { makeStyles, alpha } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  textFieldRoot: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.common.dark, 0.12),
    },
  },
}));

const WitnessForm = ({ state, handleOnChangeTF }) => {
  const classes = useStyles();

  return (
    <Box display={'flex'} flexDirection={'row'}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
        <h3>First Refference</h3>
        <Divider style={{ width: '100%' }} />
        <TextField
          type="text"
          label={'Name'}
          name="wit1_name"
          fullWidth
          onChange={handleOnChangeTF}
          value={state.wit1_name}
          margin="normal"
          variant="outlined"
          required
          className={classes.textFieldRoot}
        />
        <TextField
          type="text"
          label={'Father Name'}
          fullWidth
          name="wit1_father_name"
          value={state.wit1_father_name}
          margin="normal"
          variant="outlined"
          required
          className={classes.textFieldRoot}
          onChange={handleOnChangeTF}
        />
        <TextField
          type="number"
          label={'CNIC'}
          fullWidth
          inputProps={{ maxLength: 12 }}
          name="wit1_cnic"
          value={state.wit1_cnic}
          margin="normal"
          variant="outlined"
          onInput={e => {
            e.target.value = Math.max(0, parseInt(e.target.value))
              .toString()
              .slice(0, 13);
          }}
          required
          className={classes.textFieldRoot}
          onChange={handleOnChangeTF}
        />

        <TextField
          type="text"
          label={'Contact Number'}
          fullWidth
          name="wit1_contact"
          value={state.wit1_contact}
          margin="normal"
          variant="outlined"
          required
          className={classes.textFieldRoot}
          onChange={handleOnChangeTF}
        />
      </div>
      &nbsp;
      <Divider orientation="vertical" style={{ height: 'auto', marginTop: '50px' }} />
      &nbsp;
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
        <h3>Second Refference</h3>
        <Divider style={{ width: '100%' }} />
        <TextField
          type="text"
          label={'Name'}
          name="wit2_name"
          fullWidth
          onChange={handleOnChangeTF}
          value={state.wit2_name}
          margin="normal"
          variant="outlined"
          required
          className={classes.textFieldRoot}
        />
        <TextField
          type="text"
          label={'Father Name'}
          fullWidth
          name="wit2_father_name"
          value={state.wit2_father_name}
          margin="normal"
          variant="outlined"
          required
          className={classes.textFieldRoot}
          onChange={handleOnChangeTF}
        />
        <TextField
          type="number"
          label={'CNIC'}
          fullWidth
          inputProps={{ maxLength: 12 }}
          name="wit2_cnic"
          value={state.wit2_cnic}
          margin="normal"
          variant="outlined"
          onInput={e => {
            e.target.value = Math.max(0, parseInt(e.target.value))
              .toString()
              .slice(0, 13);
          }}
          required
          className={classes.textFieldRoot}
          onChange={handleOnChangeTF}
        />

        <TextField
          type="text"
          label={'Contact Number'}
          fullWidth
          name="wit2_contact"
          value={state.wit2_contact}
          margin="normal"
          variant="outlined"
          required
          className={classes.textFieldRoot}
          onChange={handleOnChangeTF}
        />
      </div>
    </Box>
  );
};

export default WitnessForm;

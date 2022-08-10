import React, { useState } from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { makeStyles, alpha } from '@material-ui/core/styles';
import { Constants } from '@services';

const useStyles = makeStyles(theme => ({
  textFieldRoot: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.common.dark, 0.12),
    },
  },
}));

const BasicForm = ({ data, isLoading, handleOnChangeTF }) => {
  const classes = useStyles();

  return (
    <div>
      <TextField
        type="text"
        label={'Name'}
        name="name"
        fullWidth
        onChange={handleOnChangeTF}
        // inputProps={{ pattern }}
        value={data.name}
        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
        disabled={isLoading}
      />
      <TextField
        type="text"
        label={'Father Name'}
        name="father_name"
        fullWidth
        onChange={handleOnChangeTF}
        // inputProps={{ pattern }}
        value={data.father_name}
        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
        disabled={isLoading}
      />
      <TextField
        type="text"
        label={'Contact'}
        name="contact"
        fullWidth
        onChange={handleOnChangeTF}
        // inputProps={{ pattern }}
        value={data.contact}
        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
        disabled={isLoading}
      />

      <TextField
        type="text"
        label={'Temporary Address'}
        name="temp_address"
        fullWidth
        onChange={handleOnChangeTF}
        // inputProps={{ pattern }}
        value={data.temp_address}
        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
        disabled={isLoading}
      />

      <TextField
        type="text"
        label={'Permanent Address'}
        name="perm_address"
        fullWidth
        onChange={handleOnChangeTF}
        // inputProps={{ pattern }}
        value={data.perm_address}
        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
        disabled={isLoading}
      />

      <TextField
        type="text"
        label={'Designation'}
        name="designation"
        fullWidth
        onChange={handleOnChangeTF}
        // inputProps={{ pattern }}
        value={data.designation}
        // defaultValue={data.designation}

        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
        disabled={isLoading}
      />

      <TextField
        type="text"
        label={'Employee Code'}
        name="emp_code"
        fullWidth
        onChange={handleOnChangeTF}
        // inputProps={{ pattern }}
        value={data.emp_code}
        // defaultValue={data.designation}

        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
        disabled={isLoading}
      />

      <TextField
        id="outlined-select-currency"
        select
        label="Select Employment Type"
        margin="normal"
        name="emp_type_id"
        fullWidth
        value={data.emp_type_id}
        onChange={handleOnChangeTF}
        variant="outlined">
        {Constants.EMP_TYPES.map(type => (
          <MenuItem key={type.id} value={type.id}>
            {type.title}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default BasicForm;

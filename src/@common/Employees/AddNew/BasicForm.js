import React from 'react';
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

// id	title
// 1	Daily Wages
// 2	Hourly Wages
// 3	Permanent
// 4	Temporary
// 5	Visiting
// 6	Part Time

const BasicForm = ({ state, handleOnChangeTF }) => {
  const classes = useStyles();

  return (
    <div>
      <TextField
        type="text"
        label={'Name'}
        name="name"
        fullWidth
        onChange={handleOnChangeTF}
        value={state.name}
        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
      />
      <TextField
        type="text"
        label={'Father Name'}
        fullWidth
        name="father_name"
        value={state.father_name}
        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
        onChange={handleOnChangeTF}
      />
      <TextField
        type="number"
        label={state.adult === 1 ? 'CNIC' : 'Father CNIC'}
        fullWidth
        inputProps={{ maxLength: 12 }}
        name="cnic"
        value={state.cnic}
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
        name="contact"
        value={state.contact}
        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
        onChange={handleOnChangeTF}
      />

      <TextField
        type="text"
        label={'Other Contact Number'}
        fullWidth
        // inputProps={{ pattern: pattern }}
        name="other_contact"
        value={state.other_contact}
        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
        onChange={handleOnChangeTF}
        disabled={state.is_loading}
      />

      <TextField
        type="text"
        label={'Designation'}
        fullWidth
        name="designation"
        value={state.designation}
        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
        onChange={handleOnChangeTF}
      />
      <TextField
        type="text"
        label={'Employee Code (Optional)'}
        fullWidth
        name="emp_code"
        value={state.emp_code}
        margin="normal"
        variant="outlined"
        className={classes.textFieldRoot}
        onChange={handleOnChangeTF}
      />

      <TextField
        id="outlined-select-currency"
        select
        label="Select Employment Type"
        margin="normal"
        name="emp_type_id"
        fullWidth
        value={state.emp_type_id}
        onChange={handleOnChangeTF}
        variant="outlined">
        {Constants.EMP_TYPES.map(type => (
          <MenuItem key={type.id} value={type.id}>
            {type.title}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="outlined-select-currency"
        select
        label="Select Gender"
        margin="normal"
        name="gender"
        fullWidth
        value={state.gender}
        onChange={handleOnChangeTF}
        variant="outlined">
        {Constants.GENDERS.map(type => (
          <MenuItem key={type.id} value={type.id}>
            {type.title}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="outlined-select-currency"
        select
        label="Select Employee Age Group"
        margin="normal"
        name="adult"
        fullWidth
        value={state.adult}
        onChange={handleOnChangeTF}
        variant="outlined">
        {Constants.AGES.map(type => (
          <MenuItem key={type.id} value={type.id}>
            {type.title}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        type="text"
        label={'Temporary Address'}
        fullWidth
        name="temp_address"
        value={state.temp_address}
        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
        onChange={handleOnChangeTF}
      />
      <TextField
        type="text"
        label={'Permanent Address'}
        fullWidth
        name="perm_address"
        value={state.perm_address}
        margin="normal"
        variant="outlined"
        required
        className={classes.textFieldRoot}
        onChange={handleOnChangeTF}
      />
    </div>
  );
};

export default BasicForm;

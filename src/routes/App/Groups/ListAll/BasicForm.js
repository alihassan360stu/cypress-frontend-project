import React, { useState } from 'react';
import { TextField, MenuItem, InputAdornment, IconButton } from '@material-ui/core';
import { makeStyles, alpha } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    textFieldRoot: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.common.dark, 0.12),
        }
    }
}));


const BasicForm = ({ state, handleOnChangeTF }) => {

    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div>
            <TextField
                type="text"
                label={'Full Name'}
                fullWidth
                name="full_name"
                value={state.full_name}
                margin="normal"
                variant="outlined"
                error={state.full_name.length > 0 && state.full_name.length < 5 ? true : false}
                helperText={state.full_name.length > 0 && state.full_name.length < 2 ? 'Full Name Should Have Minimum Length Of 2' : ''}
                required
                className={classes.textFieldRoot}
                onChange={handleOnChangeTF}
                disabled={state.is_loading}
            />
            <TextField
                type="text"
                label={'Contact Number'}
                fullWidth
                name="contact"
                value={state.contact}
                margin="normal"
                variant="outlined"
                error={state.contact.length > 0 && state.contact.length < 5 ? true : false}
                helperText={state.contact.length > 0 && state.contact.length < 5 ? 'Contact Number Should Have Minimum Length Of 5' : ''}
                required
                className={classes.textFieldRoot}
                onChange={handleOnChangeTF}
                disabled={state.is_loading}
            />
            {state.role.title === 'Cypress' &&
                <TextField
                    type="text"
                    label={'Allowed Devices'}
                    fullWidth
                    name="allowed_devices"
                    value={state.allowed_devices}
                    margin="normal"
                    variant="outlined"
                    required
                    className={classes.textFieldRoot}
                    onChange={handleOnChangeTF}
                    disabled={state.is_loading}
                    hidden={state.role.title !== 'Cypress'}
                />
            }
            <TextField
                type={showPassword ? 'text' : "password"}
                label={'Password'}
                onChange={handleOnChangeTF}
                fullWidth
                error={state.new_password.length > 0 && state.new_password.length < 5 ? true : false}
                helperText={state.new_password.length > 0 && state.new_password.length < 5 ? 'Password Should Have Minimum Length Of 5' : ''}
                name="new_password"
                value={state.new_password}
                margin="normal"
                variant="outlined"
                className={classes.textFieldRoot}
                disabled={state.is_loading}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" >
                            <IconButton
                                aria-label="toggle password visibility"
                                // onMouseDown={handleMouseDownPassword}>
                                onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword) }}
                            >

                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
        </div >

    );
};

export default BasicForm;

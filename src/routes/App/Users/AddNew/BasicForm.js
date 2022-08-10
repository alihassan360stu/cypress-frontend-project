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
    // const [state, setState] = useState(initalState);

    return (
        <div>
            <TextField
                type="text"
                label={'Username'}
                name="username"
                fullWidth
                onChange={handleOnChangeTF}
                // inputProps={{ pattern }}
                value={state.username}

                error={state.username.length > 0 && state.username.length < 2 ? true : false}
                helperText={state.username.length > 0 && state.username.length < 2 ? 'Username Should Have Minimum Length Of 2' : ''}

                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                disabled={state.is_loading}
            />
            <TextField
                type="text"
                label={'Full Name'}
                fullWidth
                // inputProps={{ pattern: pattern }}
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
                // inputProps={{ pattern: pattern }}
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
            
            <TextField
                type={showPassword ? 'text' : "password"}
                label={'Password'}
                onChange={handleOnChangeTF}
                fullWidth
                // inputProps={{ pattern }}

                error={state.password.length > 0 && state.password.length < 5 ? true : false}
                helperText={state.password.length > 0 && state.password.length < 5 ? 'Password Should Have Minimum Length Of 5' : ''}

                name="password"
                value={state.password}
                margin="normal"
                variant="outlined"
                required
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
            <TextField
                id="outlined-select-currency"
                select
                label="Select Role"
                margin='normal'
                name='role_id'
                fullWidth
                value={state.role_id}
                onChange={handleOnChangeTF}
                variant="outlined" >

                <MenuItem key={10002} value={-1}>
                    Not Applicable
                </MenuItem>

                {
                    state.roles.map(role => (
                        <MenuItem key={role._id} value={role._id}>
                            {role.title}
                        </MenuItem>
                    ))
                }
            </TextField>
        </div >

    );
};

export default BasicForm;

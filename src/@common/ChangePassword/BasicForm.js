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
    const [showPassword2, setShowPassword2] = useState(false)
    const [showPassword3, setShowPassword3] = useState(false)
    // const [state, setState] = useState(initalState);

    return (
        <div>
            <TextField
                type={showPassword ? 'text' : "password"}
                label={'Current Password'}
                onChange={handleOnChangeTF}
                fullWidth
                // inputProps={{ pattern }}

                error={state.current_password.length > 0 && state.current_password.length < 5 ? true : false}
                helperText={state.current_password.length > 0 && state.current_password.length < 5 ? 'Password Should Have Minimum Length Of 5' : ''}

                name="current_password"
                value={state.current_password}
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
                type={showPassword2 ? 'text' : "password"}
                label={'New Password'}
                onChange={handleOnChangeTF}
                fullWidth
                // inputProps={{ pattern }}

                error={state.new_password.length > 0 && state.new_password.length < 5 ? true : false}
                helperText={state.new_password.length > 0 && state.new_password.length < 5 ? 'Password Should Have Minimum Length Of 5' : ''}

                name="new_password"
                value={state.new_password}
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
                                onClick={(e) => { e.preventDefault(); setShowPassword2(!showPassword2) }}
                            >
                                {showPassword2 ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />

            <TextField
                type={showPassword3 ? 'text' : "password"}
                label={'Re-Type New Password'}
                onChange={handleOnChangeTF}
                fullWidth
                // inputProps={{ pattern }}

                error={state.re_new_password.length > 0 && state.re_new_password.length < 5 ? true : false}
                helperText={state.re_new_password.length > 0 && state.re_new_password.length < 5 ? 'Password Should Have Minimum Length Of 5' : ''}

                name="re_new_password"
                value={state.re_new_password}
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
                                onClick={(e) => { e.preventDefault(); setShowPassword3(!showPassword3) }}
                            >
                                {showPassword3 ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
        </div>

    );
};

export default BasicForm;

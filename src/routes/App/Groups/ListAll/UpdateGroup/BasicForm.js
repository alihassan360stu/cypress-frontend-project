import React from 'react';
import { Button, MenuItem, TextField } from '@material-ui/core';
import { makeStyles, alpha } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
const useStyles = makeStyles(theme => ({
    textFieldRoot: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.common.dark, 0.12),
        }
    }
}));


const BasicForm = ({ state, handleOnChangeTF, data, org }) => {

    const classes = useStyles();
    return (
        <div>
            <TextField
                type="text"
                label={'Group Name'}
                name="name"
                fullWidth
                onChange={handleOnChangeTF}
                value={state.name}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                disabled={state.is_loading}
            />
            <TextField
                type="text"
                label={'Description'}
                fullWidth
                name="description"
                value={state.description}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                onChange={handleOnChangeTF}
                disabled={state.is_loading}
            />

            {/* <TextField
                type="text"
                label={'Script'}
                fullWidth
                name="script"
                value={state.script}
                margin="normal"
                variant="outlined"

                error={state.script.length > 0 && state.script.length < 5 ? true : false}
                helperText={state.script.length > 0 && state.script.length < 5 ? 'Script Lenght Is Invalid' : ''}

                required
                className={classes.textFieldRoot}
                onChange={handleOnChangeTF}
                disabled={state.is_loading}
            /> */}
        </div >

    );
};

export default BasicForm;

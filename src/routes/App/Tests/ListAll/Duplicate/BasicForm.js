import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles, alpha } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    textFieldRoot: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.common.dark, 0.12),
        }
    }
}));


const BasicForm = ({placeHolder,valuePart, handleOnChangeTF,state,nameAttribute }) => {
    const classes = useStyles();
    return (
        <div>
            <TextField
                type="text"
                label={placeHolder}
                name={nameAttribute}
                fullWidth
                onChange={handleOnChangeTF}
                value={valuePart}
                margin="normal"
                variant="outlined"
                required
                className={classes.textFieldRoot}
                disabled={state.is_loading}
            />
        </div >
    );
};

export default BasicForm;

import React, { useState } from 'react';
import { TextField, CircularProgress, Box, Divider } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import Autocomplete from '@material-ui/lab/Autocomplete';

const AssocSelect = ({ handleSelect }) => {
    const { authUser } = useSelector(({ auth }) => auth);
    const [open, setOpen] = useState(false);
    const [assocs, setAssocs] = useState([]);
    const loading = open && assocs.length === 0;

    const getAssocs = (data) => {
        return new Promise((resolve, reject) => {
            Axios.post(authUser.api_url + '/assoc/queryByStatus', data).then(ans => {
                if (ans.data.status) {
                    resolve(ans.data.data)
                } else {
                    reject(ans.data.message)
                }
            }).catch(e => {
                reject(e)
            })
        })
    }

    return (
        <Box display={'flex'} width={'100%'} flexDirection={'column'}>
            <Box fontSize={{ xs: 14, sm: 16 }} display={'flex'} justifyContent={'center'} component="h1" color="text">
                Search & Select Association If Applicable
            </Box>
            <Divider />
            <br />
            <Autocomplete
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                onChange={(e, val) => {
                    e.preventDefault();
                    if (val) {
                        handleSelect('assoc_id', val.id)
                    } else {
                        handleSelect('assoc_id', null)
                    }
                }}
                getOptionSelected={(option, value) => option.title === value.title}
                getOptionLabel={option => option.title}

                options={assocs}
                loading={loading}

                renderInput={(params) => {

                    return (
                        <TextField
                            {...params}
                            label="Search Association By Name"
                            variant="outlined"
                            fullWidth
                            onChange={async (e) => {
                                e.preventDefault();
                                var value = e.currentTarget.value;
                                if (value.trim().length > 0) {
                                    var result = await getAssocs({ search: value.trim(), status: 1 });
                                    setAssocs(result)
                                } else {
                                    if (assocs.length !== 0) {
                                        setAssocs([])
                                    }
                                }
                            }}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )
                }}
            />
        </Box>
    );
};

export default AssocSelect;

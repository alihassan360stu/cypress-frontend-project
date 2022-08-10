import React from 'react';
import { Checkbox, TextField, FormGroup, FormControlLabel, Box, Divider } from '@material-ui/core';
import CmtCard from '@coremat/CmtCard';

const PermissionsSelect = ({ state, handleChange }) => {

    return (
        <Box display={'flex'} width={'100%'} flexDirection={'column'}>
            <Box fontSize={{ xs: 14, sm: 16 }} display={'flex'} justifyContent={'center'} component="h1" color="text">
                Permissions
            </Box>
            <Divider />
            <br />

            <CmtCard style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: '2%' }}>
                <FormGroup >
                    <FormControlLabel
                        control={<Checkbox checked={state.cro} onChange={handleChange} name="cro" />}
                        label="CRO"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.one_to_one} onChange={handleChange} name="one_to_one" />}
                        label="NADRA 1:1"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.psrms} onChange={handleChange} name="psrms" color="primary" />}
                        label="PSRMS"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.ctag} onChange={handleChange} name="ctag" />}
                        label="CTAC"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.cfms} onChange={handleChange} name="cfms" />}
                        label="CFMS"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.fir_copy} onChange={handleChange} name="fir_copy" />}
                        label="FIR Copy"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.tasdeeq} onChange={handleChange} name="tasdeeq" color="primary" />}
                        label="Tasdeeq"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.verisys} onChange={handleChange} name="verisys" />}
                        label="Verisys"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={state.save_log} onChange={handleChange} name="save_log" />}
                        label="Save Log"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.hidden} onChange={handleChange} name="hidden" />}
                        label="Hide In Heirarchy"
                    />
                </FormGroup>

                <FormGroup >
                    <FormControlLabel
                        control={<Checkbox checked={state.cri} onChange={handleChange} name="cri" />}
                        label="CRI"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.hr} onChange={handleChange} name="hr" />}
                        label="HRMIS"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.dl} onChange={handleChange} name="dl" color="primary" />}
                        label="EDL"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.tenant} onChange={handleChange} name="tenant" color="primary" />}
                        label="Tenant &nbsp; EMP"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.aclc} onChange={handleChange} name="aclc" color="primary" />}
                        label="ACLC"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.excise} onChange={handleChange} name="excise" color="primary" />}
                        label="Excise"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.cro_facial} onChange={handleChange} name="cro_facial" color="primary" />}
                        label="CRO Facial"
                    />

                    <FormControlLabel
                        control={<Checkbox checked={state.subscriber} onChange={handleChange} name="subscriber" color="primary" />}
                        label="Subscriber"
                    />

                    <TextField
                        type="text"
                        label={'Verisys Limit/Day'}
                        fullWidth
                        // inputProps={{ pattern: pattern }}
                        name="verisys_limit_per_day"
                        value={state.verisys_limit_per_day}
                        margin="normal"
                        onChange={handleChange}
                        variant="outlined"
                        required
                        disabled={!state.verisys}
                    />

                </FormGroup>
            </CmtCard>
        </Box>
    );
};

export default PermissionsSelect;

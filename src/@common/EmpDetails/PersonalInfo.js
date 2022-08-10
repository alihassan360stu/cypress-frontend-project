import React from 'react';
import { Box, Divider, Typography } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
        padding: '2%',
        backgroundColor: lighten(theme.palette.background.paper, 0.1),

    },

    pageTitle: {
        color: theme.palette.text.primary,
        fontWeight: 800,
        lineHeight: 1.5,
        // marginBottom: 20,
        // textShadow: '2px 4px 4px hsla(0,0%,45.9%,.8)',
        width: '100%',
        textAlign: 'left'
    },
    pageMainTitle: {
        color: theme.palette.text.primary,
        fontWeight: 800,
        lineHeight: 1.5,
        marginBottom: 20,
        textShadow: '2px 4px 4px hsla(0,0%,45.9%,.8)',
        width: '100%',
        // textAlign: 'center'
    },
    pageSubTitle: {
        color: theme.palette.text.primary,
        fontWeight: 800,
        lineHeight: 1.5,
        // marginBottom: 20,
        width: '100%',
        textAlign: 'left'
    },
    divider: {
        width: '100%',
        minHeight: 1.2,
    },
    instructions: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

function getGender(id) {
    switch (id) {
        case 1:
            return 'Male';
        case 2:
            return 'Female';
        default: return 'Transgender';
    }
}

const PersonalInformation = ({ data }) => {
    const classes = useStyles();
    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'start'} width={'100%'} className={classes.root}>
                <Typography variant='h1' className={classes.pageMainTitle} > Personal Information </Typography>
            </Box>

            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Name </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {data.name} </Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Father Name </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {data.father_name} </Typography>
            </Box>

            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > CNIC </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {data.cnic} </Typography>
            </Box>

            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Age Group </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {Number(data.is_adult) === 1 ? 'Adult' : 'Minor'} </Typography>
            </Box>

            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Gender </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {getGender(Number(data.gender))} </Typography>
            </Box>

            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Contact </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {data.contact} </Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Other Contact </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {data.other_contact} </Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} height={'auto'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Permanent Address </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {data.perm_address} </Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Temporary Address </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {data.temp_address} </Typography>
            </Box>
        </Box>
    );
};

export default PersonalInformation;

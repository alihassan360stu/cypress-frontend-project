import React from 'react';
import { Box, Divider, Typography } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '100vh',
        padding: '2%',
        margin: '0 auto',
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

const WitnessInformation = ({ data }) => {
    const classes = useStyles();
    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'start'} width={'100%'} className={classes.root}>
                <Typography variant='h1' className={classes.pageMainTitle} > References Information </Typography>
            </Box>
            {data.map(wit => {
                return (
                    <Box display={'flex'} flexDirection={'column'} alignItems={'start'} width={'100%'} className={classes.root}>
                        <Box display={'flex'} flexDirection={'column'} alignItems={'start'} width={'100%'} className={classes.root}>
                            <Typography variant='h1' className={classes.pageMainTitle} > Reference {wit.itemNo}</Typography>
                        </Box>

                        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                            <Typography variant='h5' className={classes.pageSubTitle} > Name </Typography>
                            <Typography variant='h5' className={classes.pageTitle}> {wit.name} </Typography>
                        </Box>

                        <Divider className={classes.divider} />
                        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                            <Typography variant='h5' className={classes.pageSubTitle} > Father Name </Typography>
                            <Typography variant='h5' className={classes.pageTitle}> {wit.father_name} </Typography>
                        </Box>
                        <Divider className={classes.divider} />
                        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                            <Typography variant='h5' className={classes.pageSubTitle} > CNIC </Typography>
                            <Typography variant='h5' className={classes.pageTitle}> {wit.cnic} </Typography>
                        </Box>
                        <Divider className={classes.divider} />
                        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                            <Typography variant='h5' className={classes.pageSubTitle} > Contact </Typography>
                            <Typography variant='h5' className={classes.pageTitle}> {wit.contact} </Typography>
                        </Box>
                    </Box>
                )
            })}
        </Box>
    );
};

export default WitnessInformation;

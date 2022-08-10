import React, { useState } from 'react';
import { Box, Divider, Typography } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { MediaViewer } from '../'
import CmtAvatar from '@coremat/CmtAvatar';
import { Constants } from '@services'
import { red } from '@material-ui/core/colors';


const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '100vh',
        padding: '2%',
        margin: '0 auto',
        backgroundColor: lighten(theme.palette.background.paper, 0.1),

    },
    verifiedTitle: {
        color: red[700],
        fontWeight: 800,
        lineHeight: 1.5,
        marginBottom: 20,
        textShadow: '10px 4px 10px hsla(0,0%,45.9%,.8)',
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


const PersonalInformation = ({ data }) => {
    const classes = useStyles();
    const [mediaPosition, setMediaPosition] = useState(-1);
    const [medaPreview, setMedaPreview] = useState(null);

    const handleMediaClose = () => {
        setMediaPosition(-1)
    }
    const handleMediaClick = (e) => {
        try {
            e.preventDefault();
            setMedaPreview(e.target.src)
            setMediaPosition(0)
        } catch (e) {
            console.log(e)
        }
    }

    if (Number(data.return_code) === 6) {
        return (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'start'} width={'100%'} className={classes.root}>
                    <Typography variant='h1' className={classes.pageMainTitle} > NADRA Information </Typography>
                </Box>
                <CmtAvatar style={{ alignSelf: 'left', alignItems: 'left', justifyContent: 'left', justifyItems: 'left' }} className={classes.avatar} color="#e8e8e8" size={200} variant="circular" alt="avatar" src={`data:image/png;base64, ${data.Photo}`} onClick={handleMediaClick} />
                <MediaViewer position={mediaPosition} medias={[{ preview: medaPreview, name: 'Test', metaData: { type: 'image' } }]} handleClose={handleMediaClose} />
                <br />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Name </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.Name} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Father Name / Husband Name </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.Father_Husband_Name} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > CNIC </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.cnic} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Gender </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.Gender} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Date Of Birth </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.DOB} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > CNIC Expiry Date </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.Expiry_Date} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Identification Mark </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.Identification_mark} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Current Address </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.Current_Address} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Permanent Address </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.Permanent_Address} </Typography>
                </Box>
            </Box>
        );
    } else {
        return (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'start'} width={'100%'} className={classes.root}>
                    <Typography variant='h1' className={classes.pageMainTitle} > NADRA Information </Typography>
                </Box>
                <br />
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h2' color='error' > Unable To Verify NADRA By CNIC Number {data.cnic} </Typography>
                </Box>
                <br />
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                    <Box className={classes.verifiedTitle} fontSize={{ xs: 30, sm: 30 }}>
                        {data.Remarks}
                    </Box>
                </Box>
            </Box>
        )
    }
};

export default PersonalInformation;

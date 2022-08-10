import React, { useState } from 'react';
import { Box, Divider, Typography } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { MediaViewer } from '../'
import CmtAvatar from '@coremat/CmtAvatar';
import { green } from '@material-ui/core/colors';


const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '100vh',
        padding: '2%',
        margin: '0 auto',
        backgroundColor: lighten(theme.palette.background.paper, 0.1),

    },
    verifiedTitle: {
        color: green[700],
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

function getFingerName(fingerNumber) {
    switch (fingerNumber) {
        case 1:
            return ('Right Thumb')
        case 2:
            return ('Right Index')
        case 6:
            return ('Left Thumb')
        case 7:
            return ('Left Index')

        default:
            break;
    }
}

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

    if (data) {
        return (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'start'} width={'100%'} className={classes.root}>
                    <Typography variant='h1' className={classes.pageMainTitle} > CRI Information </Typography>
                </Box>
                <br />
                <Divider className={classes.divider} />
                <MediaViewer position={mediaPosition} medias={[{ preview: medaPreview, name: 'Test', metaData: { type: 'image' } }]} handleClose={handleMediaClose} />
                {data.map((element, index) => {
                    var firsList = [];
                    try {
                        firsList = JSON.parse(element.fir_list);
                    } catch (error) {
                        firsList = [];
                    }

                    return (
                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
                            <Typography variant='h1' className={classes.pageMainTitle} > Record # {(index + 1)} </Typography>
                            <Typography variant='h1' className={classes.pageMainTitle} > Matching SCORE {element.matching_score} </Typography>
                            <Typography variant='h1' className={classes.pageMainTitle} > Matched With Finger {getFingerName(element.finger_number)} </Typography>
                            <Divider className={classes.divider} />
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                <CmtAvatar className={classes.avatar} color="#e8e8e8" size={100} variant="rounded" alt="avatar" src={`data:image/png;base64, ${element.picture_left}`} onClick={handleMediaClick} />
                                &nbsp;&nbsp;
                                <CmtAvatar className={classes.avatar} color="#e8e8e8" size={100} variant="rounded" alt="avatar" src={`data:image/png;base64, ${element.picture_front}`} onClick={handleMediaClick} />
                                &nbsp;&nbsp;
                                <CmtAvatar className={classes.avatar} color="#e8e8e8" size={100} variant="rounded" alt="avatar" src={`data:image/png;base64, ${element.picture_right}`} onClick={handleMediaClick} />
                                {/*  */}
                            </Box>
                            <Divider className={classes.divider} />
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                <Typography variant='h5' className={classes.pageSubTitle} > CNIC </Typography>
                                <Typography variant='h5' className={classes.pageTitle}> {element.cnic} </Typography>
                            </Box>
                            <Divider className={classes.divider} />
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                <Typography variant='h5' className={classes.pageSubTitle} > CRO Number </Typography>
                                <Typography variant='h5' className={classes.pageTitle}> {element.cro_no} </Typography>
                            </Box>
                            <Divider className={classes.divider} />
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                <Typography variant='h5' className={classes.pageSubTitle} > Name </Typography>
                                <Typography variant='h5' className={classes.pageTitle}> {element.full_name} </Typography>
                            </Box>
                            <Divider className={classes.divider} />
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                <Typography variant='h5' className={classes.pageSubTitle} > Name (English) </Typography>
                                <Typography variant='h5' className={classes.pageTitle}> {element.english_name} </Typography>
                            </Box>
                            <Divider className={classes.divider} />
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                <Typography variant='h5' className={classes.pageSubTitle} > Father Name </Typography>
                                <Typography variant='h5' className={classes.pageTitle}> {element.father_name} </Typography>
                            </Box>
                            <Divider className={classes.divider} />
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                <Typography variant='h5' className={classes.pageSubTitle} > Gender </Typography>
                                <Typography variant='h5' className={classes.pageTitle}> {element.gender} </Typography>
                            </Box>
                            <Divider className={classes.divider} />
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                <Typography variant='h5' className={classes.pageSubTitle} > Crime Category </Typography>
                                <Typography variant='h5' className={classes.pageTitle}> {element.crime_category} </Typography>
                            </Box>
                            <Divider className={classes.divider} />
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                <Typography variant='h5' className={classes.pageSubTitle} > CRO Entry Date </Typography>
                                <Typography variant='h5' className={classes.pageTitle}> {element.entry_date} </Typography>
                            </Box>

                            <Divider className={classes.divider} />
                            <Typography variant='h1' className={classes.pageMainTitle} > FIRs List </Typography>
                            <Divider className={classes.divider} />

                            {firsList.map((elementFIR, indexFIR) => {
                                return (
                                    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
                                        <Typography variant='h1' className={classes.pageMainTitle} > FIR # {(indexFIR + 1)} </Typography>
                                        <Divider className={classes.divider} />
                                        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                            <Typography variant='h5' className={classes.pageSubTitle} > FIR Number </Typography>
                                            <Typography variant='h5' className={classes.pageTitle}> {elementFIR.fir_no} </Typography>
                                        </Box>
                                        <Divider className={classes.divider} />
                                        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                            <Typography variant='h5' className={classes.pageSubTitle} > FIR Year </Typography>
                                            <Typography variant='h5' className={classes.pageTitle}> {elementFIR.fir_year} </Typography>
                                        </Box>
                                        <Divider className={classes.divider} />
                                        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                            <Typography variant='h5' className={classes.pageSubTitle} > FIR Sections </Typography>
                                            <Typography variant='h5' className={classes.pageTitle}> {elementFIR.section} </Typography>
                                        </Box>
                                        <Divider className={classes.divider} />
                                        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                            <Typography variant='h5' className={classes.pageSubTitle} > Police Station </Typography>
                                            <Typography variant='h5' className={classes.pageTitle}> {elementFIR.ps} </Typography>
                                        </Box>
                                        <Divider className={classes.divider} />
                                        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                                            <Typography variant='h5' className={classes.pageSubTitle} > District </Typography>
                                            <Typography variant='h5' className={classes.pageTitle}> {elementFIR.district} </Typography>
                                        </Box>
                                    </Box>
                                )
                            })}
                            <Divider className={classes.divider} />
                        </Box>
                    )
                })}
            </Box>
        )
    } else {
        return (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'start'} width={'100%'} className={classes.root}>
                    <Typography variant='h1' className={classes.pageMainTitle} > CRI Information </Typography>
                </Box>
                <br />
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                    <Box className={classes.verifiedTitle} fontSize={{ xs: 30, sm: 30 }}>
                        RECORD CLEAR
                    </Box>
                </Box>
            </Box>
        )
    }
};

export default PersonalInformation;

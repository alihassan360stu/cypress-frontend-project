import React, {  useState } from 'react';
import { Box } from '@material-ui/core';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';

import CmtAvatar from '@coremat/CmtAvatar';
import { Constants } from '@services'
import PersonalInfo from './PersonalInfo'
import EmploymentInfo from './EmploymentInfo'
import WitnessInfo from './WitnessInfo'
import { MediaViewer } from '../'


const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '100vh',
        padding: '2%',
        margin: '0 auto',
        backgroundColor: lighten(theme.palette.background.paper, 0.1),

    },
    titleRoot: {
        marginBottom: 14,
        color: theme.palette.text.primary,
    },
    textFieldRoot: {
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.common.dark, 0.12),
        }
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    pageTitle: {
        color: theme.palette.text.primary,
        fontWeight: 800,
        lineHeight: 1.5,
        marginBottom: 20,
        textShadow: '6px 4px 6px hsla(0,0%,45.9%,.8)',
    },
    button: {
        marginRight: theme.spacing(2),
    },
    backButton: {
        marginRight: theme.spacing(2),
    },
    completed: {
        display: 'inline-block',
    },
    instructions: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    avatar: {
        boxShadow: '6px 6px 6px hsla(0,0%,45.9%,.8)',
        borderRadius: '50%'
    },
}));


const EmployeeDetails = ({ isLoading = false, bioData, witnessDataParent }) => {

    const classes = useStyles();
    const [mediaPosition, setMediaPosition] = useState(-1);
    const [medaPreview, setMedaPreview] = useState(null);
    // const [isLoading, setIsLoading] = useState(true);    
    const [data, setData] = useState(bioData);
    const [witnessData, setWitnessData] = useState(witnessDataParent);

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

    return (
        data && (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
                <CmtAvatar style={{ alignSelf: 'left', alignItems: 'left', justifyContent: 'left', justifyItems: 'left' }} className={classes.avatar} color="random" size={200} variant="circular" alt="avatar" src={`${Constants.IMG_URL}/${data.picture}`} onClick={handleMediaClick} />
                <MediaViewer position={mediaPosition} medias={[{ preview: medaPreview, name: 'Test', metaData: { type: 'image' } }]} handleClose={handleMediaClose} />
                <br />
                <PersonalInfo data={data} />
                <EmploymentInfo data={data} />
                {witnessData && <WitnessInfo data={witnessData} />}
            </Box>
        )
    );
};

export default EmployeeDetails;

import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, Dialog, TextField, MenuItem, CircularProgress, Backdrop, Typography } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import { green } from '@material-ui/core/colors';
import axios from 'axios'
import Contstants from '@services/Contstants';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
const MySwal = withReactContent(Swal);

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


const Toast = MySwal.mixin({
    target: '#myTest',
    customClass: {
        container: {
            position: 'absolute',
            zIndex: 999999999,
        }
    },
    toast: true,
    position: 'top',

    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: toast => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
});

const initialState = {
    remarks: '',
    disposal_type_id: -1,
}

const Disposal = ({ data, reloadData }) => {
    const { authUser } = useSelector(({ auth }) => auth);
    const [showDialog, setShowDialog] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [state, setState] = useState(initialState)
    const [canSubmitDisp, setCanSubmitDisp] = useState(false)
    const [disposalTypes, setDisposalTypes] = useState([])

    const showMessage = (icon, text) => {
        Toast.fire({
            icon,
            title: text
        });
    }


    const classes = useStyles();
    // return (
    //     <h1>
    //         Hello Disposal
    //     </h1>
    // )

    setTimeout(() => console.log(data), 2000)

    var disposed_by = '';
    if (data.is_disposed_by_dm) {
        switch (Number(data.is_disposed_by_dm)) {
            case 1:
                disposed_by = 'Disposal Master';
                break;
            case 2:
                disposed_by = 'District ' + data.district_name;
                break;
            case 3:
                disposed_by = 'Administrator EVS';
                break;
        }
    }

    if (data.disposal) {
        return (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h1' className={classes.pageMainTitle} > Disposal Details </Typography>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Disposal Type </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.diposal_type_title} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Disposed By </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {disposed_by} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Disposed By User</Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.disposed_by_user} </Typography>
                </Box>
                <Divider className={classes.divider} />
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                    <Typography variant='h5' className={classes.pageSubTitle} > Disposal </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.disposal} </Typography>
                </Box>
            </Box>
        )
    } else {
        return (
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'start'} width={'100%'} className={classes.root}>
                    <Typography variant='h1' className={classes.pageMainTitle}> No Disposal Submitted </Typography>
                </Box>
                <Divider className={classes.divider} />
                <br />
            </Box>
        );
    }

};

export default Disposal;

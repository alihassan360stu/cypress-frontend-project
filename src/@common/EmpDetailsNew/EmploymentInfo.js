import React from 'react';
import { Box, Divider, Typography } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { green, orange, red } from '@material-ui/core/colors';
import moment from 'moment';


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


const EmploymentInfo = ({ data }) => {
    const classes = useStyles();

    const getVerificationStatus = (status) => {
        switch (status) {
            case 0:
                return (<Typography variant='h5' style={{ color: orange[500] }} className={classes.pageTitle}> Pending </Typography>);
            case 1:
                return (<Typography variant='h5' style={{ color: green[500] }} className={classes.pageTitle}> Clear </Typography>);
            case 2:
                return (<Typography variant='h5' style={{ color: red[500] }} className={classes.pageTitle}> Not Clear </Typography>);
            default:
                break;
        }
    }

    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'start'} width={'100%'} className={classes.root}>
                <Typography variant='h1' className={classes.pageMainTitle} > Employment Details </Typography>
            </Box>

            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Employee Code </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {data.emp_code} </Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Employee Type </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {data.emp_type} </Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Designation </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {data.designation} </Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Biometric Verification </Typography>
                {data.is_biometric_verified ?
                    <Typography variant='h5' style={{ color: green[500] }} className={classes.pageTitle}> Verified </Typography>
                    :
                    <Typography variant='h5' style={{ color: red[500] }} className={classes.pageTitle}> Not Verified </Typography>
                }
            </Box>
            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Verification Status </Typography>
                {getVerificationStatus(data.verification_status)}
            </Box>
            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > Joining DateTime </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {moment(data.start_date).format('ddd D/MM/YYYY hh:mm a')} </Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h5' className={classes.pageSubTitle} > End DateTime </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {data.end_date !== null ? moment(data.end_date).format('ddd D/MM/YYYY hh:mm a') : 'Currently Working Here'} </Typography>
            </Box>


            {data.end_date !== null &&
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} >
                    <Divider className={classes.divider} />
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                        <Typography variant='h5' className={classes.pageSubTitle} > Employment End Reason </Typography>
                        <Typography variant='h5' className={classes.pageTitle}> {data.emp_end_reason_title} </Typography>
                    </Box>
                    <Divider className={classes.divider} />
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                        <Typography variant='h5' className={classes.pageSubTitle} > Employment End Remarks </Typography>
                        <Typography variant='h5' className={classes.pageTitle}> {data.emp_end_reason_remarks} </Typography>
                    </Box>
                </Box>
            }

            {data.assoc_name !== null &&
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} >
                    <Divider className={classes.divider} />
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                        <Typography variant='h5' className={classes.pageSubTitle} > Association Name </Typography>
                        <Typography variant='h5' className={classes.pageTitle}> {data.assoc_name} </Typography>
                    </Box>
                </Box>
            }

            {data.comp_name !== null &&
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} >
                    <Divider className={classes.divider} />
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                        <Typography variant='h5' className={classes.pageSubTitle} > Company Name </Typography>
                        <Typography variant='h5' className={classes.pageTitle}> {data.comp_name} </Typography>
                    </Box>
                </Box>
            }

            {data.shop_name !== null &&
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} >
                    <Divider className={classes.divider} />
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                        <Typography variant='h5' className={classes.pageSubTitle} > Shop Name </Typography>
                        <Typography variant='h5' className={classes.pageTitle}> {data.shop_name} </Typography>
                    </Box>
                </Box>
            }

            {data.hotel_name !== null &&
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} >
                    <Divider className={classes.divider} />
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root}>
                        <Typography variant='h5' className={classes.pageSubTitle} > Hotel Name </Typography>
                        <Typography variant='h5' className={classes.pageTitle}> {data.hotel_name} </Typography>
                    </Box>
                </Box>
            }
        </Box>
    );
};

export default EmploymentInfo;

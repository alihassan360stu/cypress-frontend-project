import React from 'react';
import { Box, Divider, Typography, Card } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { green, orange, red } from '@material-ui/core/colors';
import moment from 'moment';
import { Constants } from '@services';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: '100vh',
        padding: '10px',
        // margin: '0 auto',
        backgroundColor: lighten(theme.palette.background.paper, 0.1),
    },
    root2: {
        maxWidth: '100vh',
        padding: '5px',
        // margin: '0 auto',
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

const temp = {
    name: 'Name',
    father_name: 'Father Name',
    contact: 'Contact',
    temp_address: 'Temporary Address',
    perm_address: 'Permanent Address',
    designation: 'Designation',
    emp_code: 'Employee Code',
    emp_type_id: 'Employee Type'
}

function getReceivedFrom(rowData) {
    if (rowData.assoc !== null)
        return 'Association';

    if (rowData.comp !== null)
        return 'Company';

    if (rowData.shop !== null)
        return 'Shop';

    if (rowData.hotel !== null)
        return 'Hotel';
}

function getReceivedFromTitle(rowData) {
    if (rowData.assoc !== null)
        return rowData.assoc;

    if (rowData.comp !== null)
        return rowData.comp;

    if (rowData.shop !== null)
        return rowData.shop;

    if (rowData.hotel !== null)
        return rowData.hotel;
}

function getEmpTypeTitleById(id) {
    var title = '';
    Constants.EMP_TYPES.forEach(element => {
        if (Number(element.id) === Number(id)) {
            title = element.title;
        }
    });
    return title;
}

const BasicForm = ({ data }) => {
    const old_data = JSON.parse(data.old_data);
    const new_data = JSON.parse(data.new_data);

    const getStatus = () => {
        switch (data.request_status) {
            case 0:
                return (<Box display={'flex'} flexDirection={'column'}
                    alignItems={'center'}
                    width={'100%'}
                    className={classes.root2}
                    style={{ backgroundColor: orange[500], color: 'white' }}
                >
                    Pending
                </Box>)
            case 1:
                return (<Box display={'flex'} flexDirection={'column'}
                    alignItems={'center'}
                    width={'100%'}
                    className={classes.root2}
                    style={{ backgroundColor: green[500], color: 'white' }}
                >
                    Approved
                </Box>)
            case 2:
                return (<Box display={'flex'} flexDirection={'column'}
                    alignItems={'center'}
                    width={'100%'}
                    className={classes.root2}
                    style={{ backgroundColor: red[500], color: 'white' }}
                >
                    Rejected
                </Box>)
            default:
                break;
        }
    }

    const classes = useStyles();
    return (
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
            <Typography variant='caption' > Employee CNIC </Typography>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root}>
                <Typography variant='h1' className={classes.pageMainTitle} style={{ textAlign: 'center' }}> {data.cnic} </Typography>
            </Box>

            <Typography variant='caption' > *<b style={{ color: green[500] }}>green</b> is orignial data and <b style={{ color: red[500] }}>red</b> is modification request </Typography>

            <Card style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }} >
                {Object.keys(old_data).map((key, index) => {
                    return (

                        <Box display={'flex'} flexDirection={'column'} alignItems={'center'} width={'100%'} className={classes.root2} key={index}>
                            <Box display={'flex'} flexDirection={'row'} justifyContent={'start'} width={'100%'} className={classes.root2}>
                                <Typography variant='h4' > {temp[key]} </Typography>
                            </Box>

                            {/* <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root2}>
                                <Typography variant='h5' className={classes.pageSubTitle} style={{ color: green[500] }}> {old_data[key]} </Typography>
                                <Typography variant='h5' className={classes.pageTitle} style={{ color: red[500] }}> {new_data[key]} </Typography>
                            </Box>
                            <Divider className={classes.divider} /> */}

                            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root2}>
                                <Typography variant='h5' className={classes.pageSubTitle} style={{ color: green[500] }}> {key === 'emp_type_id' ? getEmpTypeTitleById(old_data[key]) : old_data[key]} </Typography>
                                <Typography variant='h5' className={classes.pageTitle} style={{ color: red[500] }}>  {key === 'emp_type_id' ? getEmpTypeTitleById(new_data[key]) : new_data[key]} </Typography>
                            </Box>
                            <Divider className={classes.divider} />
                        </Box>
                        // </Card>
                    )
                })}
            </Card>

            <br />

            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root2}>
                <Typography variant='h5' className={classes.pageSubTitle}> Requested Received From </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {getReceivedFrom(data)} </Typography>
            </Box>
            <Divider className={classes.divider} />

            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root2}>
                <Typography variant='h5' className={classes.pageSubTitle}> Requested Received From Title </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {getReceivedFromTitle(data)} </Typography>
            </Box>
            <Divider className={classes.divider} />

            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root2}>
                <Typography variant='h5' className={classes.pageSubTitle}> Requested By User </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {data.created_by} </Typography>
            </Box>
            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root2}>
                <Typography variant='h5' className={classes.pageSubTitle}> Requested At </Typography>
                <Typography variant='h5' className={classes.pageTitle}> {moment(data.created_at).format('dddd D/MMM/YYYY hh:mm a')} </Typography>
            </Box>

            <Divider className={classes.divider} />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root2}>
                <Typography variant='h5' className={classes.pageSubTitle}> Request Status </Typography>
                {/* <Typography variant='h5' className={classes.pageTitle}> {data.remarks} </Typography> */}
                {getStatus()}
            </Box>

            {data.remarks &&
                <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} width={'100%'} className={classes.root2}>
                    <Typography variant='h5' className={classes.pageSubTitle}> Remarks </Typography>
                    <Typography variant='h5' className={classes.pageTitle}> {data.remarks} </Typography>
                </Box>
            }
            <br />
        </Box>
    );
};

export default BasicForm;

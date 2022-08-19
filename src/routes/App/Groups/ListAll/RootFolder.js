import React, { forwardRef, createRef, useState } from 'react';
import { Box, Button, CircularProgress } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, green, grey, orange, red } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import qs from 'qs';
import "react-virtualized/styles.css";
import {
    AddBox, ArrowDownward, Check, ChevronLeft,
    ChevronRight, Clear, DeleteOutline, Edit,
    FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn,
}
    from '@material-ui/icons';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import MaterialTable from '@material-table/core';
import { withStyles } from '@material-ui/styles';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import moment from 'moment';
const MySwal = withReactContent(Swal);
const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

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
var tableRef = createRef();
const RootFolder = (props) => {
    props.getReff(tableRef.current); // refrech table after insert group 
    const { theme } = props;
    const org = useSelector(({ org }) => org);
    const gettingSData = (event, row) => {
        if (event.detail === 2) {
            props.changRout("child");
        }
        props.getRow(row);
    }
    const columns = [
        {
            title: 'Test Name', field: 'name', render: (rowData) => {
                return (
                    <div>
                        {/* <button onDoubleClick={handleDoubleClick}>Click This Button </button>; */}
                        {/* <h4> <FolderOpenIcon style={{color:"blue"}}/> &nbsp; {rowData.name}  </h4> */}
                        <Button
                            onClick={(e) => { gettingSData(e,rowData) }}
                            style={{ padding: "1.5vh 15%", border: "none" }} variant="outlined"
                            startIcon={<FolderOpenIcon style={{ color: "blue", fontSize: "2rem" }}

                            />} >
                            {rowData.name}
                        </Button>
                    </div>
                )
            }
        },
        {
            title: 'Description', field: 'description', render: (rowData) => {
                return (
                    <div>
                        <h4>{rowData.description}</h4>
                    </div>
                )
            }
        },
        {
            title: 'Last Run', field: 'last_run', render: (rowData) => {
                return (
                    <div>
                        <h4>{rowData.last_run ? moment.utc(rowData.last_run).local().format('D/MM/YYYY hh:mm a') : 'Never Tested'}</h4>
                    </div>
                )
            }
        },
        {
            title: 'Status', field: 'is_running', render: (rowData) => {
                return (
                    <div>
                        {rowData.is_running ?
                            <Box display={'flex'} flexDirection='row' justifyContent={'center'}>
                                <h4 style={{ color: orange[500] }}> Running </h4>
                                &nbsp;
                                <CircularProgress size={20} variant='indeterminate' style={{ marginTop: '-2' }} />
                            </Box>
                            :
                            <h4 style={{ color: green[500] }}>Not Running </h4>
                        }
                    </div>
                )
            }
        }
    ]

    const getData = (params) => {
        return new Promise((resolve, reject) => {

            let { page, pageSize, search } = params
            let data = qs.stringify({
                search,
                parent: 0,
                org_id: org._id,
                page,
                pageSize,
                status: 1,
            });

            var config = {
                method: 'post',
                url: '/group',
                data: data
            };


            Axios(config).then(ans => {
                if (ans.data.status) {
                    // ans.data.data.map(item => {
                    //   item.is_running = false;
                    //   console.log("api data is ")
                    // })
                    props.getData(ans.data.data.groups);
                    resolve(ans.data.data.groups)
                } else {
                    reject(ans.data.message)
                }
            }).catch(e => {
                console.log(e)
                reject(e)
            })
        })
    }

    //   const blockCall = (data) => {
    //     return new Promise((resolve, reject) => {
    //       Axios.post(authUser.api_url + '/block-unblock-user', data).then(ans => {
    //         if (ans.data.status) {
    //           resolve(ans.data.message)
    //         } else {
    //           reject(ans.data.message)
    //         }
    //       }).catch(e => {
    //         reject(e)
    //       })
    //     })
    //   }

    //   const editRowClick = async (event, rowData) => {
    //     event.preventDefault();
    //     setTimeout(() => {
    //       setDialogState(prevState => ({ ...prevState, show: true, rowData }))
    //       // setDialogState({ show: true, rowData })
    //     }, 10);
    //   }

    //   const blockRowClick = async (event, rowData) => {
    //     event.preventDefault();

    //     MySwal.fire({
    //       title: 'Are you sure?',
    //       text: "Do You Want To " + (rowData.status ? 'Block' : 'Unblock') + " This User",
    //       icon: 'warning',
    //       showCancelButton: true,
    //       confirmButtonText: rowData.status ? 'Yes, Block it !' : 'Yes, Unblock It !',
    //       cancelButtonText: 'No, cancel !',
    //       reverseButtons: true,
    //     }).then(async result => {
    //       if (result.value) {
    //         try {
    //           const result = await blockCall({ user_id: rowData._id, status: !rowData.status })
    //           MySwal.fire('Success', result, 'success');
    //           setDialogState(prevState => ({ ...prevState, refreshData: true }))
    //         } catch (e) {
    //           MySwal.fire('Error', e, 'error');
    //         }
    //       }
    //     });
    //   }

    return (
        <div>
            <MaterialTable
                tableRef={tableRef}
                icons={tableIcons}
                title="Root"
                columns={columns}
                // actions={actions}
                data={async (query) => {
                    try {
                        var { orderBy, orderDirection, page, pageSize, search } = query;
                        const data = await getData({ orderBy: orderBy ? orderBy.field : null, orderDirection, page: (page + 1), pageSize, search });
                        return new Promise((resolve, reject) => {
                            resolve({
                                data: data,
                                page: query.page,
                                totalCount: data.count //? state.totalAssociations : 5//state.totalAssociations
                            })
                        })
                    } catch (e) {
                        return new Promise((resolve, reject) => {
                            resolve({
                                data: [],
                                page: query.page,
                                totalCount: 0 //? state.totalAssociations : 5//state.totalAssociations
                            })
                        })
                    }
                }}
                page={1}

                options={{
                    actionsColumnIndex: -1,
                    draggable: false,
                    sorting: false,
                    headerStyle: {
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff'
                    },
                    cellStyle: {
                        hover: blue[500]
                    },
                    rowStyle: (rowData, index) => ({
                        backgroundColor: (index % 2 === 0) ? grey[50] : '#FFF',
                        padding: 10
                    }),
                    exportMenu: [{
                        label: 'Export PDF',
                        exportFunc: (cols, datas) => ExportPdf(cols, datas, 'List All Users ' + moment().format('DD-MM-YYYY'))
                    }, {
                        label: 'Export CSV',
                        exportFunc: (cols, datas) => ExportCsv(cols, datas, 'List All Users ' + moment().format('DD-MM-YYYY'))
                    }],
                    showFirstLastPageButtons: true,
                    pageSize: 20,
                    padding: 'default',
                    pageSizeOptions: [20, 50, 100],
                }}
            />
        </div>
    );
};

export default (withStyles({}, { withTheme: true })(RootFolder));

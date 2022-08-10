import React, { useState, forwardRef, useEffect, createRef } from 'react';
import { Box, TextField, MenuItem, Divider, Chip } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, green, grey, red } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';

import {
  AddBox, ArrowDownward, Check, ChevronLeft,
  ChevronRight, Clear, DeleteOutline, Edit,
  FilterList, FirstPage, LastPage, Lock, LockOpen, Remove, SaveAlt, Search, ViewColumn,
}
  from '@material-ui/icons';

import MaterialTable from '@material-table/core';
import { withStyles } from '@material-ui/styles';
import EditDialog from './EditDialog';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import moment from 'moment'; 

const MySwal = withReactContent(Swal);

const breadcrumbs = [];

const useStyles = makeStyles(theme => ({

  actionBlueButton: {
    color: blue[50],
    '&:hover': {
      backgroundColor: blue[700],
      color: '#fff',
    },
  },
  root: {
    maxWidth: '100vh',
    padding: '2%',
    margin: '0 auto',
    backgroundColor: lighten(theme.palette.background.paper, 0.1),
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
  tableNumberField: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 1.5,
    marginBottom: 20,
    textShadow: '2px 2px 3px hsla(0,0%,45.9%,.8)',
  },
}));

const initalState = {
  totalData: 0,
  is_loading: true,
  showDialog: false,
  rowData: {}
}

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


const initialDialogState = {
  show: false,
  refreshData: false,
  showPerm: false,
  rowData: {}
}

var tableRef = createRef();

const deviceTypesState = [
  { id: -1, title: 'All Devices' },
  { id: 1, title: 'Active' },
  { id: 2, title: 'Pending' },
]
const ListAll = (props) => {
  const { theme } = props;
  const classes = useStyles();
  const [dialogState, setDialogState] = useState(initialDialogState);
  const { authUser } = useSelector(({ auth }) => auth);
  const [deviceTypes, setDeviceTypes] = useState(deviceTypesState);
  const [deviceType, setDeviceType] = useState(-1);

  const columns = [
    {
      title: 'S#', width: "4%", field: 'index', render: (rowData) => {
        return (
          <div>
            <h4>{rowData.index}</h4>
          </div>
        )
      }
    },
    {
      title: 'Username', field: 'user_id.username', render: (rowData) => {
        return (
          <div>
            {console.log(rowData)}
            <h3>{rowData.user_id ? rowData.user_id.username : 'N-A'}</h3>
          </div>
        )
      }
    },
    {
      title: 'Full Name', field: 'user_id.full_name', render: (rowData) => {
        return (
          <div>
            <h3>{rowData.user_id ? rowData.user_id.full_name : 'N-A'}</h3>
          </div>
        )
      }
    },
    {
      title: 'Contact', field: 'rowData.user_id.contact', render: (rowData) => {
        return (
          <div>
            <h3>{rowData.user_id ? rowData.user_id.contact : 'N-A'}</h3>
          </div>
        )
      }
    },
    {
      title: 'Device Name', field: 'name', render: (rowData) => {
        return (
          <div>
            <h3>{rowData.name}</h3>
          </div>
        )
      }
    },
    {
      title: 'Status', field: 'is_approved', render: (rowData) => {
        return (
          <div>
            {rowData.is_approved ?
              <Chip size="small" label="Approved" color="primary" style={{ background: green[500] }} />
              :
              <Chip size="small" label="Pending" color="secondary" />
            }
            {/* <h3>{rowData.role}</h3> */}
          </div>
        )
      }
    }
  ]

  const getData = (data) => {
    return new Promise((resolve, reject) => {
      Axios.post(authUser.api_url + '/search-devices', { ...data, type: deviceType }).then(ans => {
        if (ans.data.status) {
          resolve(ans.data.data)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        reject(e)
      })
    })
  }

  const blockCall = (data) => {
    return new Promise((resolve, reject) => {
      Axios.post(authUser.api_url + '/block-unblock-device', data).then(ans => {
        if (ans.data.status) {
          resolve(ans.data.message)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        reject(e)
      })
    })
  }

  const deleteCall = (data) => {
    return new Promise((resolve, reject) => {
      Axios.post(authUser.api_url + '/delete-device', data).then(ans => {
        if (ans.data.status) {
          resolve(ans.data.message)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        reject(e)
      })
    })
  }

  const blockRowClick = async (event, rowData) => {
    event.preventDefault();

    MySwal.fire({
      title: 'Are you sure?',
      text: "Do You Want To " + (rowData.is_approved ? 'Block' : 'Unblock') + " This Device",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: rowData.is_approved ? 'Yes, Block it !' : 'Yes, Unblock It !',
      cancelButtonText: 'No, cancel !',
      reverseButtons: true,
    }).then(async result => {
      if (result.value) {
        try {
          const result = await blockCall({ device_id: rowData._id, status: !rowData.is_approved })
          MySwal.fire('Success', result, 'success');
          setDialogState(prevState => ({ ...prevState, refreshData: true }))
        } catch (e) {
          MySwal.fire('Error', e, 'error');
        }
      }
    });
  }

  const deleteRowClick = async (event, rowData) => {
    event.preventDefault();

    MySwal.fire({
      title: 'Are you sure?',
      text: "Do You Want To Delete This Device",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete !',
      cancelButtonText: 'No, cancel !',
      reverseButtons: true,
    }).then(async result => {
      if (result.value) {
        try {
          const result = await deleteCall({ device_id: rowData._id })
          MySwal.fire('Success', result, 'success');
          setDialogState(prevState => ({ ...prevState, refreshData: true }))
        } catch (e) {
          MySwal.fire('Error', e, 'error');
        }
      }
    });
  }

  const actions = [
    row => (
      {
        icon: () => !row.is_approved ? <LockOpen style={{ color: green[500] }} /> : <Lock style={{ color: red[500] }} />,
        className: classes.actionBlueButton,
        tooltip: ((!row.is_approved ? 'Unblock ' : 'Block ') + row.name),
        onClick: blockRowClick
      }
    ),
    row => (
      {
        icon: () => <DeleteOutline style={{ color: red[500] }} />,
        className: classes.actionBlueButton,
        tooltip: 'Delete Device ' + row.name,
        onClick: deleteRowClick
      }
    ),
  ]

  if (dialogState.refreshData) {
    tableRef.current.onQueryChange()
    setDialogState(prevState => ({ ...prevState, refreshData: false }))
  }

  const showMessage = (icon, text) => {
    Toast.fire({
      icon,
      title: text
    });
  }

  const handleTypeChange = (e) => {
    var { value } = e.target;
    e.preventDefault();
    setDeviceType(value)
    tableRef.current.onQueryChange()
  }

  return (
    <div>
      <PageContainer heading="" breadcrumbs={breadcrumbs}>
        <div>
          <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
            Registered Devices
          </Box>
        </div>
        <Divider />
        <br />
        <h4>Filter By Device Status</h4>

        <TextField
          id="outlined-select-currency"
          select
          label="Select Type"
          margin='normal'
          name='deviceType'
          fullWidth
          value={deviceType}
          onChange={handleTypeChange}
          variant="outlined" >
          {
            deviceTypes.map(type => (
              <MenuItem key={type.id} value={type.id}>
                {type.title}
              </MenuItem>
            ))
          }
        </TextField>
        <br />

        <MaterialTable
          tableRef={tableRef}
          icons={tableIcons}
          title="Devices List"
          columns={columns}
          actions={actions}
          data={async (query) => {
            try {
              var { orderBy, orderDirection, page, pageSize, search } = query;
              const data = await getData({ orderBy: orderBy ? orderBy.field : null, orderDirection, page: (page + 1), pageSize, search });
              return new Promise((resolve, reject) => {
                resolve({
                  data,
                  page: query.page,
                  totalCount: data.length //? state.totalAssociations : 5//state.totalAssociations
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
              exportFunc: (cols, datas) => ExportPdf(cols, datas, 'List All Devices ' + moment().format('DD-MM-YYYY'))
            }, {
              label: 'Export CSV',
              exportFunc: (cols, datas) => ExportCsv(cols, datas, 'List All Devices ' + moment().format('DD-MM-YYYY'))
            }],
            showFirstLastPageButtons: true,
            pageSize: 20,
            padding: 'default',
            pageSizeOptions: [20, 50, 100],
          }}
        />

        {dialogState.show && <EditDialog dialogState={dialogState} setDialogState={setDialogState} />}
      </PageContainer>
      {/* } */}
    </div>
  );
};

export default (withStyles({}, { withTheme: true })(ListAll));

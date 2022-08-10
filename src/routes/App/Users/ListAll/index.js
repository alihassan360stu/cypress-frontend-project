import React, { useState, forwardRef, useEffect, createRef } from 'react';
import { Box, TextField, MenuItem, Divider, Chip } from '@material-ui/core';
import { MenuList, Paper, Popover } from '@material-ui/core';

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
  Accessibility,
  MoreVert
}
  from '@material-ui/icons';

import MaterialTable from '@material-table/core';
import { withStyles } from '@material-ui/styles';
import EditDialog from './EditDialog';
import PermissionsSelect from './PermissionsSelect';
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

const initialStatusTypes = [
  { id: -1, title: 'All Type' },
  { id: 1, title: 'Active' },
  { id: 2, title: 'Blocked' },
]

const ListAll = (props) => {
  const { theme } = props;
  const classes = useStyles();
  const [dialogState, setDialogState] = useState(initialDialogState);
  const { authUser } = useSelector(({ auth }) => auth);
  const [roles, setRoles] = useState([]);
  const [moreOptions, setMoreOptions] = useState([]);
  const [role_id, setRoleId] = useState(-1);
  const [status, setStatus] = useState(-1);
  const [statusTypes, setStatusTypes] = useState(initialStatusTypes);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
      title: 'Username', field: 'username', render: (rowData) => {
        return (
          <div>
            <h3>{rowData.username}</h3>
          </div>
        )
      }
    },
    {
      title: 'Full Name', field: 'full_name', render: (rowData) => {
        return (
          <div>
            <h3>{rowData.full_name}</h3>
          </div>
        )
      }
    },
    {
      title: 'Contact', field: 'contact', render: (rowData) => {
        return (
          <div>
            <h3>{rowData.contact}</h3>
          </div>
        )
      }
    },
    {
      title: 'Role', field: 'role', render: (rowData) => {
        return (
          <div>
            <h3>{rowData.role.title}</h3>
          </div>
        )
      }
    },
    {
      title: 'Last Login', field: 'last_login', render: (rowData) => {
        return (
          <div>
            <h3>{moment.utc(rowData.last_login).local().format('D/MM/YYYY hh:mm a')}</h3>
          </div>
        )
      }
    },
    {
      title: 'Status', field: 'status', render: (rowData) => {
        return (
          <div>
            {rowData.status ?
              <Chip size="small" label="Active" color="primary" style={{ background: green[500] }} />
              :
              <Chip size="small" label="Blocked" color="secondary" />
            }
            {/* <h3>{rowData.role}</h3> */}
          </div>
        )
      }
    }
  ]

  const getData = (data) => {
    return new Promise((resolve, reject) => {
      Axios.post(authUser.api_url + '/search-users', { ...data, role_id, status }).then(ans => {
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
      Axios.post(authUser.api_url + '/block-unblock-user', data).then(ans => {
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

  const editRowClick = async (event, rowData) => {
    event.preventDefault();
    setTimeout(() => {
      setDialogState(prevState => ({ ...prevState, show: true, rowData }))
      // setDialogState({ show: true, rowData })
    }, 10);
  }

  const editPermRowClick = async (event, rowData) => {
    event.preventDefault();
    setTimeout(() => {
      setDialogState(prevState => ({ ...prevState, showPerm: true, rowData }))
      // setDialogState({ show: true, rowData })
    }, 10);
  }

  const blockRowClick = async (event, rowData) => {
    event.preventDefault();

    MySwal.fire({
      title: 'Are you sure?',
      text: "Do You Want To " + (rowData.status ? 'Block' : 'Unblock') + " This User",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: rowData.status ? 'Yes, Block it !' : 'Yes, Unblock It !',
      cancelButtonText: 'No, cancel !',
      reverseButtons: true,
    }).then(async result => {
      if (result.value) {
        try {
          const result = await blockCall({ user_id: rowData._id, status: !rowData.status })
          MySwal.fire('Success', result, 'success');
          setDialogState(prevState => ({ ...prevState, refreshData: true }))
        } catch (e) {
          MySwal.fire('Error', e, 'error');
        }
      }
    });
  }

  const handlePopoverOpen = (event, rowData) => {
    setMoreOptionsByRowData(rowData)
    setAnchorEl(event.currentTarget);
  };

  const setMoreOptionsByRowData = (row) => {
    const tempData = [];
    if (row.status) {
      tempData.push(
        <MenuItem onClick={(e) => {
          handlePopoverClose()
          editRowClick(e, row)
        }}>
          <Edit style={{ color: blue[500] }} />
          &nbsp;<div className="ml-2"> Edit </div>
        </MenuItem>
      )

      if (row.role.title === 'Cypress') {
        tempData.push(
          <MenuItem onClick={(e) => {
            handlePopoverClose()
            editPermRowClick(e, row)
          }}>
            <Accessibility style={{ color: blue[500] }} />
            &nbsp;<div className="ml-2"> Edit Permissions </div>
          </MenuItem>
        )
      }
    }
    tempData.push(
      <MenuItem onClick={(e) => {
        handlePopoverClose()
        blockRowClick(e, row)
      }}>
        {!row.status ? <LockOpen style={{ color: green[500] }} /> : <Lock style={{ color: red[500] }} />}
        &nbsp;<div className="ml-2"> {!row.status ? 'Unblock ' : 'Block '} </div>
      </MenuItem>
    )
    setMoreOptions(tempData);
  }


  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const actions = [
    row => (
      {
        icon: () => <MoreVert style={{ color: blue[500] }} />,
        className: classes.actionBlueButton,
        tooltip: 'Show More Options',
        onClick: handlePopoverOpen
      }
    ),
    // row => (
    //   {
    //     icon: () => <Edit style={{ color: blue[500] }} />,
    //     className: classes.actionBlueButton,
    //     tooltip: 'Edit ' + row.username,
    //     onClick: editRowClick,
    //     hidden: !row.status
    //   }
    // ),
    // row => (
    //   {
    //     icon: () => <Accessibility style={{ color: blue[500] }} />,
    //     className: classes.actionBlueButton,
    //     tooltip: 'Edit Permissions',
    //     onClick: editPermRowClick,
    //     hidden: row.role.title !== 'Cypress' || !row.status
    //   }
    // ),
    // row => (
    //   {
    //     icon: () => !row.status ? <LockOpen style={{ color: green[500] }} /> : <Lock style={{ color: red[500] }} />,
    //     className: classes.actionBlueButton,
    //     tooltip: ((!row.status ? 'Unblock ' : 'Block ') + row.username),
    //     onClick: blockRowClick
    //   }
    // ),
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

  const handleRoleChange = (e) => {
    var { value } = e.target;
    e.preventDefault();
    setRoleId(value)
    tableRef.current.onQueryChange()
  }

  const handleStatusChange = (e) => {
    var { value } = e.target;
    e.preventDefault();
    setStatus(value)
    tableRef.current.onQueryChange()
  }

  const getRoles = async () => {
    try {
      Axios.post(authUser.api_url + '/get-user-roles').then(ans => {
        if (ans.data.status) {
          setRoles(ans.data.data)
        } else {
          showMessage('error', ans.data.message)
        }
      }).catch(e => {
        showMessage('error', e)
      })
    } catch (e) {

    }
  }


  useEffect(() => {
    getRoles()
  }, [])


  return (
    <div>
      <PageContainer heading="" breadcrumbs={breadcrumbs}>
        <div>
          <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
            All Users
          </Box>
        </div>
        <Divider />
        <br />
        <Box style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: '2%' }}>
          <div style={{ width: '100%' }}>
            <h4>Filter By User Role</h4>

            <TextField
              id="outlined-select-currency"
              select
              label="Select Role"
              margin='normal'
              name='role_id'
              fullWidth
              value={role_id}
              onChange={handleRoleChange}
              variant="outlined" >

              <MenuItem key={10002} value={-1}>
                All Roles
              </MenuItem>

              {
                roles.map(role => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.title}
                  </MenuItem>
                ))
              }
            </TextField>
          </div>
          &nbsp;&nbsp;
          <div style={{ width: '100%' }}>
            <h4>Filter By User Status</h4>

            <TextField
              id="outlined-select-currency"
              select
              label="Select Status"
              margin='normal'
              name='status'
              fullWidth
              value={status}
              onChange={handleStatusChange}
              variant="outlined" >
              {
                statusTypes.map(status => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.title}
                  </MenuItem>
                ))
              }
            </TextField>
          </div>
        </Box>

        <br />
        <MaterialTable
          tableRef={tableRef}
          icons={tableIcons}
          title="Users List"
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

        {open && (
          <Popover
            open={open}
            anchorEl={anchorEl}
            container={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}>
            <Paper elevation={8}>
              <MenuList>
                {/* {moreOptions.map(element => {
                  { element }
                })} */}

                {moreOptions}
              </MenuList>



            </Paper>
          </Popover>
        )}
        {dialogState.show && <EditDialog dialogState={dialogState} setDialogState={setDialogState} />}
        {dialogState.showPerm && <PermissionsSelect dialogState={dialogState} setDialogState={setDialogState} />}
      </PageContainer>
      {/* } */}
    </div>
  );
};

export default (withStyles({}, { withTheme: true })(ListAll));

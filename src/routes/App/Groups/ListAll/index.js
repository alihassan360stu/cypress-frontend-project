import React, { useState, forwardRef, createRef } from 'react';
import { Box, MenuItem, Divider, Button, CircularProgress } from '@material-ui/core';
import { MenuList, Paper, Popover } from '@material-ui/core';

import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, green, grey, orange, red } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import qs from 'qs';

import { Column, Table, SortDirection, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";

import {
  AddBox, ArrowDownward, Check, ChevronLeft,
  ChevronRight, Clear, DeleteOutline, Edit,
  FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn,
  MoreVert, FileCopy, ControlPointDuplicate, Delete, PlayArrow,
}
  from '@material-ui/icons';

import MaterialTable from '@material-table/core';
import { withStyles } from '@material-ui/styles';
import EditDialog from './EditDialog';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import moment from 'moment';
import AddNew from './AddNew';
import Duplicate from './Duplicate';

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

const ListAll = (props) => {
  const { theme } = props;
  const classes = useStyles();
  const [dialogState, setDialogState] = useState(initialDialogState);
  const [refereshData, setRefereshData] = useState(false);
  const [rowData, setRowData] = useState(undefined);
  const [showCreateDial, setShowCreateDial] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);

  const { authUser } = useSelector(({ auth }) => auth);
  const [moreOptions, setMoreOptions] = useState([]);
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
      title: 'Test Name', field: 'name', render: (rowData) => {
        return (
          <div>
            <h4>{rowData.name}</h4>
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
        page,
        pageSize,
        status: 1,
      });

      var config = {
        method: 'post',
        url: '/test',
        data: data
      };

      Axios(config).then(ans => {
        if (ans.data.status) {
          ans.data.data.map(item => {
            item.is_running = false;
          })
          resolve(ans.data.data)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        console.log(e)
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
    tempData.push(
      <MenuItem onClick={(e) => {
        handlePopoverClose()
        showMessage('warning', 'Under Development');
      }}>
        <PlayArrow /> &nbsp; Run Test
      </MenuItem>
    )

    tempData.push(
      <MenuItem onClick={(e) => {
        handlePopoverClose()
        setRowData(row)
        setShowDuplicate(true)
      }}>
        <FileCopy /> &nbsp; Duplicate
      </MenuItem>
    )
    tempData.push(
      <MenuItem onClick={(e) => {
        handlePopoverClose()
        showMessage('warning', 'Under Development');
      }}>
        <Edit /> &nbsp; Edit
      </MenuItem>
    )
    tempData.push(
      <MenuItem onClick={(e) => {
        handlePopoverClose()
        showMessage('warning', 'Under Development');
      }}>
        <Delete /> &nbsp; Delete
      </MenuItem>
    )

    tempData.push(
      <MenuItem onClick={(e) => {
        handlePopoverClose()
        showMessage('warning', 'Under Development');
      }}>
        <ControlPointDuplicate /> &nbsp; Update Group
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
        onClick: handlePopoverOpen,
        hidden: row.is_running
      }
    ),
  ]

  if (dialogState.refreshData) {
    tableRef.current.onQueryChange()
    setDialogState(prevState => ({ ...prevState, refreshData: false }))
  }

  if (refereshData) {
    tableRef.current.onQueryChange()
    setRefereshData(false);
  }

  const showMessage = (icon, text) => {
    Toast.fire({
      icon,
      title: text
    });
  }

  return (
    <div>
      <PageContainer heading="" breadcrumbs={breadcrumbs}>
        <div>
          <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
            All Tests
          </Box>
        </div>
        <Divider />
        <br />
        <Box display='flex' flexDirection='row' justifyContent='end'>
          <Button type='button' variant="contained" color="primary" onClick={() => { setShowCreateDial(true) }}>
            Create New Test
          </Button>
        </Box>
        <br />
        <MaterialTable
          tableRef={tableRef}
          icons={tableIcons}
          title="Tests List"
          columns={columns}
          actions={actions}
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
                {moreOptions}
              </MenuList>
            </Paper>
          </Popover>
        )}

        {showCreateDial && <AddNew hideDialog={setShowCreateDial} setRefereshData={setRefereshData} />}
        {showDuplicate && <Duplicate hideDialog={setShowDuplicate} setRefereshData={setRefereshData} rowData={rowData} />}
      </PageContainer>
      {/* } */}
    </div>
  );
};

export default (withStyles({}, { withTheme: true })(ListAll));

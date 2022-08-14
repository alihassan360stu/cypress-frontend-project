import React, { useState, forwardRef, createRef } from 'react';
import { Box, MenuItem, CircularProgress, Fab, Tooltip } from '@material-ui/core';
import { MenuList, Paper, Popover } from '@material-ui/core';

import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, green, orange } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import qs from 'qs';
import Fade from 'react-reveal/Fade';


import "react-virtualized/styles.css";

import {
  AddBox, ArrowDownward, Check, ChevronLeft,
  ChevronRight, Clear, DeleteOutline, Edit,
  FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn,
  MoreVert, FileCopy, ControlPointDuplicate, Delete, PlayArrow, Add,
}
  from '@material-ui/icons';

import MaterialTable from '@material-table/core';
import { withStyles } from '@material-ui/styles';
import EditDialog from './Edit';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import moment from 'moment';
import AddNew from './AddNew';
import Duplicate from './Duplicate';
import BrowserSelect from './BrowserSelect';
import MultiRun from './MultiRun';
import { useEffect } from 'react';

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
  buttons: {
    // transition: 'all 6.6s ease',
    transition: 'opacity 2.6s ease-in',
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
  // const [runningIds, setRunningIds] = useState([]);
  const [showCreateDial, setShowCreateDial] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [showBrowserSelect, setShowBrowserSelect] = useState(false);
  const [showMultiRun, setShowMultiRun] = useState(false);
  const [checkingAsync, setCheckingAsync] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const org = useSelector(({ org }) => org);
  const [selectedRows, setSelectedRows] = useState([]);

  const [moreOptions, setMoreOptions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const columns = [
    {
      title: 'S#', width: "4%", field: 'index', render: (rowData) => {
        return (
          <div>
            <h5>{rowData.index}</h5>
          </div>
        )
      }
    },
    {
      title: 'Test Name', field: 'name', render: (rowData) => {
        return (
          <div>
            <h5>{rowData.name}</h5>
          </div>
        )
      }
    },
    {
      title: 'Description', field: 'description', render: (rowData) => {
        return (
          <div>
            <h5>{rowData.description}</h5>
          </div>
        )
      }
    },
    {
      title: 'Last Run', field: 'last_run', render: (rowData) => {
        return (
          <div>
            <h5>{rowData.last_run ? moment.utc(rowData.last_run).local().format('D/MM/YYYY hh:mm a') : 'Never Tested'}</h5>
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
                <h5 style={{ color: orange[500] }}> Running </h5>
                &nbsp; &nbsp;
                <CircularProgress size={20} variant='indeterminate' style={{ marginTop: '-2' }} />
              </Box>
              :
              <h5 style={{ color: green[500] }}>Idle </h5>
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
        org_id: org._id
      });

      var config = {
        method: 'post',
        url: '/test',
        data: data
      };

      Axios(config).then(ans => {
        if (ans.data.status) {
          let runningIds = localStorage.getItem('runningIds');
          runningIds = runningIds ? JSON.parse(runningIds) : []

          ans.data.data.map(item => {
            if (runningIds.includes(item._id))
              item.is_running = true;
            else
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

  const editRowClick = async () => {
    setTimeout(() => {
      setRowData(selectedRows[0])
      setShowEdit(true)
    }, 10);
  }

  const duplicateRowClick = async () => {
    setTimeout(() => {
      setRowData(selectedRows[0])
      setShowDuplicate(true)
    }, 10);
  }

  const deleteCall = (data) => {
    return new Promise((resolve, reject) => {
      Axios.post('/test/delete', data).then(ans => {
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

  const deleteRowClick = async (rowData) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "Do You Want To Remove This Test",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete it !',
      cancelButtonText: 'No, cancel !',
      reverseButtons: true,
    }).then(async result => {
      if (result.value) {
        try {
          const result = await deleteCall({ test_id: rowData._id })
          MySwal.fire('Success', result, 'success');
          setRefereshData(true)
        } catch (e) {
          MySwal.fire('Error', e, 'error');
        }
      }
    });
  }

  const deleteMultiRow = async () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "Do You Want To Remove All Selected Tests",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete All !',
      cancelButtonText: 'No, cancel !',
      reverseButtons: true,
    }).then(async result => {
      if (result.value) {
        try {
          setBusy(true)
          let dataRows = selectedRows;
          for (let x = 0; x < dataRows.length; x++) {
            await deleteCall({ test_id: dataRows[x]._id })
            setRefereshData(true)
          }
          setBusy(false)
          MySwal.fire('Success', "Successfully Remove All Selected Tests", 'success');
        } catch (e) {
          setBusy(false)
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
        setRowData(row)
        setShowBrowserSelect(true)
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
        editRowClick(row)
      }}>
        <Edit /> &nbsp; Edit
      </MenuItem>
    )
    tempData.push(
      <MenuItem onClick={(e) => {
        handlePopoverClose()
        deleteRowClick(row)
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

  const testRunApi = (params) => {
    return new Promise((resolve, reject) => {
      let { test_id, browser } = params
      let data = qs.stringify({
        test_id,
        browser,
        org_id: org._id
      });

      var config = {
        method: 'post',
        url: '/test/run',
        data: data
      };

      Axios(config).then(ans => {
        if (ans.data.status) {
          resolve(true)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        console.log(e)
        reject(e)
      })
    })
  }

  const testRunCall = async (browser) => {

    let row = selectedRows[0];
    let runningIds = localStorage.getItem('runningIds');
    runningIds = runningIds ? JSON.parse(runningIds) : []

    try {
      if (!runningIds.includes(row._id)) {
        runningIds.push(row._id);
        localStorage.setItem('runningIds', JSON.stringify(runningIds))
        setRefereshData(true)
        let params = {
          test_id: row._id,
          browser
        }
        await testRunApi(params)
        runningIds = localStorage.getItem('runningIds');
        runningIds = runningIds ? JSON.parse(runningIds) : []
        localStorage.setItem('runningIds', JSON.stringify(runningIds.filter(e => e != row._id)))
        setTimeout(() => {
          setRefereshData(true)
        }, 500);
      }
    } catch (e) {
      runningIds = localStorage.getItem('runningIds');
      runningIds = runningIds ? JSON.parse(runningIds) : []
      localStorage.setItem('runningIds', JSON.stringify(runningIds.filter(e => e != row._id)))
      setTimeout(() => {
        setRefereshData(true)
      }, 500);
      showMessage('error', e, 'error')
    }
  }

  const testRunSync = (params) => {
    return new Promise((resolve, reject) => {
      let { test_id, browser } = params
      let data = qs.stringify({
        test_id,
        browser,
        org_id: org._id
      });

      var config = {
        method: 'post',
        url: '/test/bulk-run',
        data: data
      };

      Axios(config).then(ans => {
        if (ans.data.status) {
          resolve(true)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        console.log(e)
        reject(e)
      })
    })
  }

  const testRunAsync = (params) => {
    return new Promise((resolve, reject) => {
      let { test_id, browser } = params
      let data = qs.stringify({
        test_id,
        browser,
        org_id: org._id
      });

      var config = {
        method: 'post',
        url: '/test/bulk-run-concurrent',
        data: data
      };

      Axios(config).then(ans => {
        if (ans.data.status) {
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

  const testRunCallMulti = async (browser, type) => {

    let runningIds = localStorage.getItem('runningIds');
    runningIds = runningIds ? JSON.parse(runningIds) : []
    let idsToRun = [];
    try {
      for (let x = 0; x < selectedRows.length; x++) {
        idsToRun.push(selectedRows[x]._id)
      }

      idsToRun = idsToRun.filter(id => !runningIds.includes(id))
      runningIds = idsToRun.concat(runningIds);
      localStorage.setItem('runningIds', JSON.stringify(runningIds))
      setRefereshData(true)

      let params = {
        test_id: idsToRun.join(","),
        browser
      }

      if (type == 1) {
        await testRunSync(params)
        runningIds = localStorage.getItem('runningIds');
        runningIds = runningIds ? JSON.parse(runningIds) : []
        runningIds = idsToRun.filter(id => !runningIds.includes(id));
        localStorage.setItem('runningIds', JSON.stringify(runningIds))
        setTimeout(() => {
          setRefereshData(true)
        }, 500);

      } else {
        let remoteIds = await testRunAsync(params)
        localStorage.setItem('asyncIds', JSON.stringify(remoteIds))
        setTimeout(() => {
          setRefereshData(true);
          if (checkingAsync)
            setCheckingAsync(false);
        }, 500);
      }
    } catch (e) {
      runningIds = localStorage.getItem('runningIds');
      runningIds = runningIds ? JSON.parse(runningIds) : []
      runningIds = idsToRun.filter(id => !runningIds.includes(id));
      localStorage.setItem('runningIds', JSON.stringify(runningIds))
      setTimeout(() => {
        setRefereshData(true)
      }, 500);
      showMessage('error', e, 'error')
    }
  }

  const checkTestApi = (params) => {
    return new Promise((resolve, reject) => {
      let { id } = params
      let data = qs.stringify({
        id
      });

      var config = {
        method: 'post',
        url: '/test/test-status',
        data: data
      };

      Axios(config).then(ans => {
        if (ans.data.status) {
          resolve(ans.data.code)
        } else {
          reject(ans.data.message)
        }
      }).catch(e => {
        console.log(e)
        reject(e)
      })
    })
  }

  const checkTests = async () => {
    try {


      let asyncIds = localStorage.getItem('asyncIds');
      asyncIds = asyncIds ? JSON.parse(asyncIds) : []
      if (asyncIds.length > 0) {
        for (let x = 0; x < asyncIds.length; x++) {
          let id = asyncIds[x];
          try {
            let code = await checkTestApi({ id });
            if (Number(code) === 2) {
              let runningIds = localStorage.getItem('runningIds');
              runningIds = runningIds ? JSON.parse(runningIds) : []
              let testId = id.split("_")[1];
              runningIds = runningIds.filter(id => id !== testId);
              localStorage.setItem('runningIds', JSON.stringify(runningIds))
              localStorage.setItem('asyncIds', JSON.stringify(asyncIds.filter(element => element !== id)))
              setTimeout(() => {
                setRefereshData(true)
              }, 500);
            }
          } catch (error) {
            alert(error)
            let runningIds = localStorage.getItem('runningIds');
            runningIds = runningIds ? JSON.parse(runningIds) : []
            let testId = id.split("_")[1];
            runningIds = runningIds.filter(id => id !== testId);
            localStorage.setItem('runningIds', JSON.stringify(runningIds))
            localStorage.setItem('asyncIds', JSON.stringify(asyncIds.filter(element => element !== id)))
            setTimeout(() => {
              setRefereshData(true)
            }, 500);
          }
        }
        setTimeout(() => {
          checkTests();
        }, 2000);
      }
    } catch (error) {

    }
  }

  if (!checkingAsync) {
    checkTests();
    setCheckingAsync(true)
  }

  useEffect(() => {
    localStorage.removeItem('runningIds');
    localStorage.removeItem('asyncIds');
    tableRef.current.onQueryChange()
  }, [org])

  const actions = [
    row => (
      {
        icon: () => <MoreVert style={{ color: blue[500] }} />,
        className: classes.actionBlueButton,
        tooltip: 'Show More Options',
        onClick: handlePopoverOpen,
        hidden: row.is_running || busy
      }
    ),
  ]

  if (dialogState.refreshData) {
    tableRef.current.onQueryChange()
    setDialogState(prevState => ({ ...prevState, refreshData: false }))
    setSelectedRows([])
  }

  if (refereshData) {
    tableRef.current.onQueryChange()
    setRefereshData(false);
    setSelectedRows([])
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
        <br />
        <div className={'container max-width-adaptive-sm Scroll reveal effects'} style={{ marginTop: "-6%" }}>
          <Box display='flex' flexDirection='row' justifyContent='end' className='reveal-fx reveal-fx--translate-up' >
            {selectedRows.length > 0 &&
              <Fade bottom opposite cascade >
                &nbsp;&nbsp;
                <Tooltip
                  title={"Run Test"}
                >
                  <Fab size="small" color="default" aria-label="add" onClick={() => {
                    if (selectedRows.length == 1) {
                      setRowData(selectedRows[0])
                      setShowBrowserSelect(true)
                    } else {
                      setShowMultiRun(true)
                    }
                  }} disabled={busy}>
                    <PlayArrow />
                  </Fab>
                </Tooltip>
                &nbsp;&nbsp;
              </Fade>
            }

            {selectedRows.length === 1 &&
              <Fade bottom opposite cascade >
                &nbsp;&nbsp;
                <Tooltip
                  title={"Edit"}
                >
                  <Fab size="small" color="default" aria-label="add" onClick={editRowClick} disabled={busy}>
                    <Edit />
                  </Fab>
                </Tooltip>
                &nbsp;&nbsp;
              </Fade>
            }

            {selectedRows.length === 1 &&
              <Fade bottom opposite cascade >
                &nbsp;&nbsp;
                <Tooltip
                  title={"Duplicate"}
                >
                  <Fab size="small" color="default" aria-label="add" onClick={duplicateRowClick} disabled={busy}>
                    <FileCopy />
                  </Fab>
                </Tooltip>
                &nbsp;&nbsp;
              </Fade>
            }

            {selectedRows.length > 0 &&
              <Fade bottom opposite cascade>
                &nbsp;&nbsp;
                <Tooltip
                  title={"Delete"}
                >
                  <Fab size="small" color="default" aria-label="add" onClick={deleteMultiRow} disabled={busy}>
                    <Delete />
                  </Fab>
                </Tooltip>
                &nbsp;&nbsp;
              </Fade>
            }
            &nbsp;&nbsp;
            <Tooltip
              title={"Create New Test"}
            >
              <Fab size="small" color="default" aria-label="add" onClick={() => { setShowCreateDial(true) }} disabled={busy}>
                <Add />
              </Fab>
            </Tooltip>
          </Box>
        </div>
        <br />
        <MaterialTable
          tableRef={tableRef}
          icons={tableIcons}
          title="Tests List"
          columns={columns}
          onSelectionChange={(rows) => {
            setSelectedRows(rows);
          }}
          // actions={actions}
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
            selectionProps: (rowData) => {
              let runningIds = localStorage.getItem('runningIds');
              runningIds = runningIds ? JSON.parse(runningIds) : []
              let disabled = runningIds.includes(rowData._id)
              return ({ disabled })
            },
            // actionsColumnIndex: -1,
            selection: true,
            showSelectAllCheckbox: true,
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
              backgroundColor: (selectedRows.includes(rowData)) ? '#EEE' : '#FFF',
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

        {
          open && (
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
          )
        }

        {showCreateDial && <AddNew hideDialog={setShowCreateDial} setRefereshData={setRefereshData} />}
        {showDuplicate && <Duplicate hideDialog={setShowDuplicate} setRefereshData={setRefereshData} rowData={rowData} />}
        {showEdit && <EditDialog hideDialog={setShowEdit} setRefereshData={setRefereshData} rowData={rowData} />}
        {showBrowserSelect && <BrowserSelect showDialog={setShowBrowserSelect} testRunCall={testRunCall} />}
        {showMultiRun && <MultiRun showDialog={setShowMultiRun} testRunCall={testRunCallMulti} />}

      </PageContainer >
      {/* } */}
    </div >
  );
};

export default (withStyles({}, { withTheme: true })(ListAll));

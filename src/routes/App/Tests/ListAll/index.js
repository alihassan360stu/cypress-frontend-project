import React, { useState, forwardRef, createRef, useEffect } from 'react';
import { Box, MenuItem, Divider, Button } from '@material-ui/core';
import {
  MenuList, Paper, Popover, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Typography, CircularProgress, Backdrop, Checkbox, Avatar
} from '@material-ui/core';

import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, green, grey, orange, red } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import qs from 'qs';

import {
  AddBox, ArrowDownward, Check, ChevronLeft,
  ChevronRight, Clear, DeleteOutline, Edit,
  FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn,
  MoreVert, FileCopy, ControlPointDuplicate, Delete, PlayArrow, Close
}
  from '@material-ui/icons';
import GetAppIcon from '@material-ui/icons/GetApp';
import BackupIcon from '@material-ui/icons/Backup';
import MaterialTable from '@material-table/core';
import BurstModeIcon from '@material-ui/icons/BurstMode';
import { withStyles } from '@material-ui/styles';
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
    lineHeight: 0.5,
    marginBottom: 5,
    textShadow: '6px 4px 6px hsla(0,0%,45.9%,.8)',
  },
  tableNumberField: {
    color: theme.palette.text.primary,
    fontWeight: 800,
    lineHeight: 0.5,
    marginBottom: 5,
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
  const [editTest, setEditTest] = useState(false);
  const [deleteTest, setDeleteTest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState({ index: 0, status: false });
  const [testRun, setTestRun] = useState({});
  const [runAllTest, setRunAllTes] = useState(false);
  const [testSelectId, setTestSelectId] = useState([{ testId: "" }]);
  const [getAllTestCases, setGetAllTestCases] = useState([]);
  const [countCheckBox, setCountCheckBox] = useState(0);
  const { authUser } = useSelector(({ auth }) => auth);
  const [moreOptions, setMoreOptions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  let checking = (rowData) => { // setting checkbox open or no
    var ifatchingId = false;
    testSelectId.map((value) => {
      if (value.testId === rowData._id) {
        ifatchingId = true;
      }
    })
    if (ifatchingId) {
      return true;
    }
    else {
      return false
    }
  }
  const columns = [
    {
      title: countCheckBox > 1 ? <span style={{ cursor: "pointer" }} onClick={() => {
        var temp = [testSelectId.length];
        testSelectId.map((value, i) => {
          temp[i] = { testId: "" };
        })
        setTestSelectId(temp);
        setCountCheckBox(0);
        setRunAllTes(false)
      }}>
        Un Select
      </span>
        :
        <span style={{ cursor: "pointer" }}
          onClick={() => {
            if (Array.isArray(getAllTestCases)) {
              setTestSelectId([{ testId: "" }])
              var temp = [getAllTestCases.length];
              getAllTestCases.map((value, index) => {
                temp[index] = { testId: value._id };
              });
              setCountCheckBox(temp.length);
              setTestSelectId(temp);
            }
          }}>
          Select All
        </span>
      , field: 'index', render: (rowData) => {
        return (
          <div>
            <Checkbox
              checked={checking(rowData) ? true : false}
              onChange={() => {
                var checkingIdMatchOrNo = true;
                testSelectId.map((value) => {
                  if (value.testId === rowData._id) {
                    checkingIdMatchOrNo = false;
                  }
                })

                if (checkingIdMatchOrNo) {
                  var checkTemproryId = true;
                  var index = 0;
                  testSelectId.map((value, i) => {
                    if (value.testId === "") {
                      checkTemproryId = false;
                      index = i;
                      return
                    }
                  })
                  if (checkTemproryId) {
                    setTestSelectId([...testSelectId, { testId: rowData._id }])
                    setCountCheckBox(countCheckBox + 1);
                    return null
                  } // new test insertion 
                  else {
                    var temp = testSelectId;
                    temp[index] = { testId: rowData._id };
                    setTestSelectId(temp)
                    setCountCheckBox(countCheckBox + 1);
                    return null;
                  } // again upodate code
                }
                else {
                  testSelectId.map((value, i) => {
                    if (value.testId === rowData._id) {
                      var temp = testSelectId;
                      temp[i] = { testId: "" };
                      setTestSelectId(temp)
                      setCountCheckBox(countCheckBox - 1);
                      return null
                    }
                  })
                }

              }} />
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
      title: 'Failed', field: 'failed', render: (rowData) => {
        return (
          <div>
            <h4>{index.index===rowData.index&&!loading?` ${testRun.data.data.pass}/${testRun.data.data.fail}`:"0/0"}</h4>
          </div>
        )
      }
    },
    {
      title: 'Success Rate', field: 'successEate', render: (rowData) => {
        return (
          <Box width="100%" display="flex" alignItems="center">

            <Box width="90%" display="flex" marginRight="1%">
              <Box width={"60%"} bgcolor="green" height={"2vh"}></Box>
              <Box width={"40%"} bgcolor="red"></Box>
            </Box>
            <Typography variant='h5'>
              60%
            </Typography>
          </Box>
        )
      }
    },
    {
      title: 'Status', field: 'status', render: (rowData) => {
        return (
          <div>
            {rowData.status ?
              <h4 style={{ color: orange[500] }}>
                {
                  index.index===rowData.index? !index.status? <CircularProgress color="secondary" />:"complete":"Not Running"
                  // setIndex({ index: row.index, status:false})
                }</h4>

              :
              <h4 style={{ color: green[500] }}>Not Running</h4>
            }
            {/* setTestRun(response)
                setIndex({ index: row.index, status: true })
                setLoading(false) */}
          </div>
        )
      }
    }
  ]

  const getData = (params) => {
    return new Promise((resolve, reject) => {
      let { page, pageSize, search } = params
      let data = qs.stringify({
        search: "case",
        pageSize: pageSize,
        status: 1,
        page: page,
        orderBy: 1,
        orderDirection: 1
      });
      var config = {
        method: 'post',
        url: 'http://3.21.230.123:3008/api/test',
        data: data,
      };

      Axios(config).then(ans => {
        if (ans.data.status) {
          setGetAllTestCases(ans.data.data)
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
      <MenuItem
        key={"2"}
        onClick={(e) => {
          console.log("row data is ", row)
          var data = qs.stringify({
            test_id: row._id,
            browser: 'chrome',
            org_id: '62f710f8ac8a4a4028a3473f'
          });

          var config = {
            method: 'post',
            url: 'http://3.21.230.123:3008/api/test/run',
            data: data
          };
          setIndex({ index: row.index, status:false});
          setLoading(true)
          Axios(config)
            .then(function (response) {
              if (response.data.status) {
                setTestRun(response)
                console.log("api is ", response)
                setIndex({ index: row.index, status: true })
                setLoading(false)
              }
              else {
                // setIndex({ index: row.index, status: false })
                MySwal.fire('Error', response.data.message, 'error');
                setLoading(false)
              }
            })
            .catch(function (error) {
              setIndex({ index: row.index, status: true })
              console.log("erroe",error);
              setLoading(false)
            });
          handlePopoverClose()
        }}>
        <PlayArrow style={{ color: "green" }} /> &nbsp; Run Test
      </MenuItem>
    )
    tempData.push(
      <MenuItem
        key={"3"}
        onClick={(e) => {
          handlePopoverClose()
          setRowData(row)
          setDeleteTest(true)
        }}>
        <Delete style={{ color: "red" }} /> &nbsp; Delete
      </MenuItem>
    )
    tempData.push(
      <MenuItem
        key={"4"}
        onClick={(e) => {
          handlePopoverClose()
          setRowData(row)
          setShowDuplicate(true)
        }}>
        <FileCopy style={{ color: "black" }} /> &nbsp; Duplicate
      </MenuItem>
    )
    tempData.push(
      <MenuItem
        key={"5"}
        onClick={(e) => {
          handlePopoverClose()
          setRowData(row)
          setEditTest(true)
        }}>
        <Edit style={{ color: "black" }} /> &nbsp; Edit
      </MenuItem>
    )
    tempData.push(
      <MenuItem
        key={"6"}
        onClick={(e) => {
          handlePopoverClose()
          showMessage('warning', 'Under Development');
        }}>
        <ControlPointDuplicate style={{ color: "black" }} /> &nbsp; Update Group
      </MenuItem>
    )
    tempData.push(
      <MenuItem
        key={"8"}
        onClick={(e) => {
          handlePopoverClose()
          showMessage('warning', 'Under Development');
        }}>
        <BackupIcon style={{ color: "black" }} /> &nbsp; Upload
      </MenuItem>
    )
    tempData.push(
      <MenuItem
        key={"7"}
        onClick={(e) => {
          handlePopoverClose()
          showMessage('warning', 'Under Development');
        }}>
        <GetAppIcon style={{ color: "black" }} /> &nbsp; Download
      </MenuItem>
    )
    tempData.push(
      <MenuItem
        key={"8s"}
        onClick={(e) => {
          handlePopoverClose()
          showMessage('warning', 'Under Development');
        }}>
        <BurstModeIcon style={{ color: "black" }} /> &nbsp; Test Results
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
        <Box display="flex" width="100%" height="8vh" justifyContent={countCheckBox > 1 ? "" : "end"} lineHeight="1.5">
          {
            countCheckBox > 1 &&
            <Box bgcolor="white" height="6vh" width="20%" display="flex" justifyContent="center" alignItems="center" lineHeight="40px">
              <PlayArrow style={{ color: "green", cursor: "pointer" }} />
              <Edit style={{ color: "black", marginRight: "8%", marginLeft: "8%", cursor: "pointer" }} />
              <FileCopy style={{ color: "black", cursor: "pointer" }} />
            </Box>
          }
          <Box width="80%" display='flex' flexDirection='row' justifyContent='end'>
            <Button type='button' variant="contained" style={{ height: "6vh" }} color="primary" onClick={() => { setShowCreateDial(true) }}>
              Create New Test
            </Button>
          </Box>
        </Box>
        <MaterialTable
          tableRef={tableRef}
          icons={tableIcons}
          columns={columns}
          actions={actions}
          title="Group"
          data={async (query) => {
            // querry data is option data 
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
          }
          }
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
              hover: blue[500],
              Text: "center"
            },
            rowStyle: (rowData, index) => ({
              backgroundColor: (index % 2 === 0) ? grey[50] : '#FFF', textAlign: "center"
              // padding:
            }),
            exportMenu: [{
              label: 'Export PDF',
              exportFunc: (cols, datas) => ExportPdf(cols, datas, 'List All Users ' + moment().format('DD-MM-YYYY'))
            }, {
              label: 'Export CSV',
              exportFunc: (cols, datas) => ExportCsv(cols, datas, 'List All Users ' + moment().format('DD-MM-YYYY'))
            }],
            showFirstLastPageButtons: true,
            pageSize: 10,
            padding: 'default',
            pageSizeOptions: [10, 20, 50, 100],
          }}
        />
        {/* open state is used for action items ( clone test, edit test etc ) and open is array that have assigng thr tempData [] array*/}
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
        )}   {/* open state is used for action items ( clone test, edit test etc ) and open is array that have assigng thr tempData [] array*/}

        {deleteTest &&
          <Dialog open={true} maxWidth="sm" fullWidth>
            <DialogTitle>
              <br />

              <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="secondary" />
              </Backdrop>
              <Box style={{ textAlign: "center" }}><Typography variant="h6">Do You Want To Delete Test Record</Typography></Box>
            </DialogTitle>
            <Box position="absolute" top={0} right={0}>
              <IconButton>
                <Close onClick={() => { setDeleteTest(false) }} />
              </IconButton>
            </Box>
            <DialogContent>
              <br />
            </DialogContent>
            <DialogActions style={{ marginBottom: "2%", marginRight: "37%" }}>
              <Button onClick={() => { setDeleteTest(false) }} style={{ marginRight: "2%", }} color="primary" variant="contained">
                NO
              </Button>
              <Button onClick={() => {
                var data = qs.stringify({
                  test_id: rowData._id
                });

                var config = {
                  method: 'post',
                  url: 'http://3.21.230.123:3008/api/test/delete',
                  data: data
                };

                setLoading(true);
                Axios(config).then((data) => {
                  setLoading(false);
                  setDeleteTest(false)
                  setRefereshData(true)
                  showMessage('success');
                }).catch((error) => {
                  setLoading(false);
                  setDeleteTest(false)
                })

              }}
                color="secondary" variant="contained">
                YES
              </Button>
            </DialogActions>
          </Dialog>}
        {/* runAllTest */}
        {showCreateDial && <AddNew hideDialog={setShowCreateDial} setRefereshData={setRefereshData} />}
        {showDuplicate && <Duplicate name="clone" hideDialog={setShowDuplicate} setRefereshData={setRefereshData} rowData={rowData} />}   {/* for clone test */}
        {editTest && <Duplicate name="edit" hideDialog={setEditTest} setRefereshData={setRefereshData} rowData={rowData} />}
      </PageContainer>
    </div>
  );
};

export default (withStyles({}, { withTheme: true })(ListAll));


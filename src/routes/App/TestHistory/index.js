import React, { useState, forwardRef, useEffect, createRef } from 'react';
import { Box, TextField, MenuItem, Chip, Divider } from '@material-ui/core';

import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, green, grey } from '@material-ui/core/colors';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';

import {
  AddBox, ArrowDownward, Check, ChevronLeft,
  ChevronRight, Clear, DeleteOutline, Edit,
  FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn,
} from '@material-ui/icons';

import MaterialTable from '@material-table/core';
import { withStyles } from '@material-ui/styles';
import { ExportCsv, ExportPdf } from '@material-table/exporters';
import moment from 'moment';
import { Constants } from '@services';
import Chart from './Chart'
import TestInfo from './TestInfo'

var crypto = require('crypto');
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
    // maxWidth: '100vh',
    // padding: '2%',
    // margin: '0 auto',
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


const initState = [
  { name: 'Today', value: 1 },
  { name: 'Yesterday', value: 2 },
  { name: 'Last 7 Days', value: 3 },
  { name: 'Last 30 Days', value: 4 },
]

var tableRef = createRef();

const ListAll = (props) => {
  const { theme, match } = props;
  const classes = useStyles();
  const [testId, setTestId] = useState(null);
  const [data, setData] = useState(null);
  const [dateStatus, setDateStatus] = useState(1);
  const [dateStatusArr, setDateStatusArr] = useState(initState);

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
      title: 'Browser', field: 'browser', render: (rowData) => {
        return (
          <div>
            <h5>{rowData.browser}</h5>
          </div>
        )
      }
    },
    {
      title: 'Started At', field: 'start_duration', render: (rowData) => {
        return (
          <div>
            <h5>{moment.duration(moment().utc().local().diff(moment(rowData.start_duration).utc().local())).humanize()} ago</h5>
          </div>
        )
      }
    },
    {
      title: 'Duration', field: 'duration', render: (rowData) => {
        return (
          <div>
            <h5>{moment.duration((moment(rowData.start_duration).utc().local().diff(moment(rowData.end_duration).utc().local()))).humanize()}</h5>
          </div>
        )
      }
    },
    {
      title: 'Status', field: 'status', render: (rowData) => {
        return (
          <div>
            {rowData.pass === 1 ?
              <Chip size="small" label="Pass" color="primary" style={{ background: green[500] }} />
              :
              <Chip size="small" label="Failed" color="secondary" />
            }
            {/* <h5>{rowData.role}</h5> */}
          </div>
        )
      }
    }
  ]

  const getData = () => {
    return new Promise((resolve, reject) => {
      if (testId) {
        Axios.post('test/detail', { test_id: testId, type: dateStatus }).then(ans => {
          if (ans.data.status) {
            setData(ans.data.data);
            resolve(ans.data.data)
          } else {
            reject(ans.data.message)
          }
        }).catch(e => {
          reject(e)
        })
      } else reject(false)
    })
  }

  useEffect(() => {
    try {
      var decipher = crypto.createDecipher(Constants.ALGO, Constants.TKV);
      var id = decipher.update(match.params.id, 'hex', 'utf8') + decipher.final('utf8');
      setTestId(id)
      tableRef.current.onQueryChange()
    } catch (error) {

    }
  }, [testId])


  return (
    <PageContainer heading="" breadcrumbs={breadcrumbs}>

      <div className={'container max-width-adaptive-sm Scroll reveal effects '} style={{ marginTop: "-6%" }}>
        <Box style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
          <div style={{ width: '30%' }}>
            <TextField
              id="outlined-select-currency"
              select
              label="Select Status"
              margin='normal'
              name='date_status'
              fullWidth
              value={dateStatus}
              onChange={(e) => {
                e.preventDefault();
                let { value } = e.target;
                setDateStatus(value)
                tableRef.current.onQueryChange()
              }}
              variant="outlined" >
              {
                dateStatusArr.map(role => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.name}
                  </MenuItem>
                ))
              }
            </TextField>
          </div>
        </Box>
        <TestInfo data={data}/>
        <br />
        <Divider />
        <br />
        <Chart />
        <br />
        <MaterialTable
          tableRef={tableRef}
          icons={tableIcons}
          title="Test Runs"
          columns={columns}
          data={async (query) => {
            try {
              const data = await getData();
              return new Promise((resolve, reject) => {
                resolve({
                  data: data.history,
                  page: query.page,
                  totalCount: data.history.length //? state.totalAssociations : 5//state.totalAssociations
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
              // padding: 10,
              height: 5,
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
    </PageContainer>
  );
};

export default (withStyles({}, { withTheme: true })(ListAll));

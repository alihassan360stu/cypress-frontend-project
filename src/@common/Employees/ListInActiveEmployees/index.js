import React, { useState, forwardRef, useEffect, createRef } from 'react';
import { Box, CircularProgress, Backdrop, Divider } from '@material-ui/core';
import { lighten, makeStyles } from '@material-ui/core/styles';
import { blue, grey } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Axios from 'axios';
import CmtAvatar from '@coremat/CmtAvatar';
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  ArrowForward,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from '@material-ui/icons';

import MaterialTable from '@material-table/core';
import { withStyles } from '@material-ui/styles';
import moment from 'moment';
import { Constants } from '@services';
import { MediaViewer } from '@common';
import { ExportCsv, ExportPdf } from '@material-table/exporters';

const MySwal = withReactContent(Swal);
var crypto = require('crypto');

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
  avatar: {
    boxShadow: '6px 6px 6px hsla(0,0%,45.9%,.8)',
    borderRadius: '50%',
  },
}));

const initalState = {
  totalData: 0,
  is_loading: true,
  showDialog: false,
  rowData: {},
};

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

const initialDialogState = {
  show: false,
  refreshData: false,
  rowData: {},
};

const Toast = MySwal.mixin({
  target: '#myTest',
  customClass: {
    container: {
      position: 'absolute',
      zIndex: 999999999,
    },
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

const ListAll = props => {
  const { theme } = props;
  const classes = useStyles();
  const [state, setState] = useState(initalState);
  const [mediaPosition, setMediaPosition] = useState(-1);
  const [medaPreview, setMedaPreview] = useState(null);
  const [dialogState, setDialogState] = useState(initialDialogState);
  const { authUser } = useSelector(({ auth }) => auth);

  const showMessage = (icon, text) => {
    Toast.fire({
      icon,
      title: text,
    });
  };

  const getTotal = () => {
    Axios.post(authUser.api_url + '/emp/count', { is_employeed: 0 })
      .then(ans => {
        if (ans.data.status) {
          setState(prevState => ({ ...prevState, is_loading: false, totalData: ans.data.data.total }));
          tableRef.current.onQueryChange();
        } else {
          setState(prevState => ({ ...prevState, is_loading: false }));
        }
      })
      .catch(e => {
        setState(prevState => ({ ...prevState, is_loading: false }));
      });
  };

  const getData = data => {
    return new Promise((resolve, reject) => {
      try {
        Axios.post(authUser.api_url + '/emp/query', { ...data, is_employeed: 0 })
          .then(ans => {
            if (ans.data.status) {
              resolve(ans.data.data);
            } else {
              reject(ans.data.message);
            }
          })
          .catch(e => {
            reject(e);
          });
      } catch (e) {
        showMessage('error', e);
        reject(e);
      }
    });
  };

  const detailsRowClick = async (event, rowData) => {
    event.preventDefault();
    var cipher = crypto.createCipher(Constants.ALGO, Constants.TKV);
    var encrypted = cipher.update(rowData.id, 'utf8', 'hex') + cipher.final('hex');
    // window.open(window.location.origin + '/app/comp/emp/' + encrypted, '_blank');
    window.open(window.location.origin + `/app/${authUser.api_url}/emp/` + encrypted, '_blank');
    // history.push('/app/comp/emp/' + rowData.id)
  };

  const actions = [
    row => ({
      icon: () => <ArrowForward style={{ color: blue[500] }} />,
      className: classes.actionBlueButton,
      tooltip: 'Details ' + row.name,
      onClick: detailsRowClick,
    }),
  ];

  if (dialogState.refreshData) {
    tableRef.current.onQueryChange();
    setDialogState(prevState => ({ ...prevState, refreshData: false }));
  }

  const handleMediaClose = () => {
    setMediaPosition(-1);
  };
  const handleMediaClick = e => {
    try {
      e.preventDefault();
      setMedaPreview(e.target.src);
      setMediaPosition(0);
    } catch (e) {
      showMessage('error', e);
    }
  };

  useEffect(() => {
    getTotal();
  }, []);

  const columns = [
    {
      title: 'S#',
      width: '4%',
      field: 'itemNo',
      render: rowData => {
        return (
          <div>
            <h4>{rowData.itemNo}</h4>
            {/* <Box className={classes.tableNumberField} fontSize={{ xs: 15, sm: 15 }}>
                            {rowData.itemNo}
                        </Box> */}
          </div>
        );
      },
    },
    {
      title: 'Image',
      export: false,
      field: 'profile',
      render: rowData => {
        return (
          <CmtAvatar
            className={classes.avatar}
            color="random"
            size={60}
            variant="circular"
            alt="avatar"
            src={`${Constants.IMG_URL}/${rowData.picture}`}
            onClick={handleMediaClick}
          />
        );
      },
    },
    {
      title: 'Name',
      field: 'name',
      render: rowData => {
        return (
          <div>
            <h4>{rowData.name}</h4>
          </div>
        );
      },
    },
    {
      title: 'Father Name',
      field: 'father_name',
      render: rowData => {
        return (
          <div>
            <h4>{rowData.father_name}</h4>
          </div>
        );
      },
    },
    {
      title: 'CNIC',
      field: 'cnic',
      render: rowData => {
        return (
          <div>
            <h4>{rowData.cnic}</h4>
          </div>
        );
      },
    },
    {
      title: 'Contact',
      field: 'contact',
      render: rowData => {
        return (
          <div>
            <h4>{rowData.contact}</h4>
          </div>
        );
      },
    },
    {
      title: 'Other Contact',
      field: 'other_contact',
      render: rowData => {
        return (
          <div>
            <h4>{rowData.other_contact}</h4>
          </div>
        );
      },
    },
    {
      title: 'Designation',
      field: 'designation',
      render: rowData => {
        return (
          <div>
            <h4>{rowData.designation}</h4>
          </div>
        );
      },
    },
    {
      title: 'Emp: Type',
      field: 'emp_type',
      render: rowData => {
        return (
          <div>
            <h4>{rowData.emp_type}</h4>
          </div>
        );
      },
    },
    {
      title: 'End Date',
      field: 'end_date',
      render: rowData => {
        return (
          <div>
            <h4>{moment(rowData.end_date).format('dddd D/MMM/YYYY')}</h4>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {/* {state.is_loading ? (
        <Backdrop className={classes.backdrop} open={state.is_loading}>
          <CircularProgress color="secondary" />
        </Backdrop>
      ) : ( */}
        <PageContainer heading="" breadcrumbs={breadcrumbs}>
          <div>
            <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
              InActive Employees
            </Box>
          </div>
          <Divider />
          <br />
          <br />

          <MaterialTable
            tableRef={tableRef}
            icons={tableIcons}
            title="Employees List"
            columns={columns}
            actions={actions}
            data={async query => {
              try {
                if (state.totalData > 0) {
                  var { orderBy, orderDirection, page, pageSize, search } = query;
                  const data = await getData({
                    orderBy: orderBy ? orderBy.field : null,
                    orderDirection,
                    page: page + 1,
                    pageSize,
                    search,
                  });
                  return new Promise((resolve, reject) => {
                    resolve({
                      data,
                      page: query.page,
                      totalCount: state.totalData, //? state.totalAssociations : 5//state.totalAssociations
                    });
                  });
                } else {
                  throw new Error('Test');
                }
              } catch (e) {
                return new Promise((resolve, reject) => {
                  resolve({
                    data: [],
                    page: query.page,
                    totalCount: 0, //? state.totalAssociations : 5//state.totalAssociations
                  });
                });
              }
            }}
            page={1}
            options={{
              actionsColumnIndex: -1,
              draggable: false,
              sorting: false,
              headerStyle: {
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
              },
              rowStyle: (rowData, index) => ({
                backgroundColor: index % 2 === 0 ? grey[50] : '#FFF',
              }),
              exportMenu: [
                {
                  label: 'Export PDF',
                  exportFunc: (cols, datas) => ExportPdf(cols, datas, 'InActive Employees ' + moment().format('DD-MM-YYYY')),
                },
                {
                  label: 'Export CSV',
                  exportFunc: (cols, datas) => ExportCsv(cols, datas, 'InActive Employees ' + moment().format('DD-MM-YYYY')),
                },
              ],
              showFirstLastPageButtons: true,
              pageSize: 20,
              padding: 'default',
              pageSizeOptions: [20, 50, 100],
            }}
          />

          <MediaViewer
            position={mediaPosition}
            medias={[{ preview: medaPreview, name: 'Test', metaData: { type: 'image' } }]}
            handleClose={handleMediaClose}
          />
        </PageContainer>
      {/* )} */}
    </div>
  );
};

export default withStyles({}, { withTheme: true })(ListAll);

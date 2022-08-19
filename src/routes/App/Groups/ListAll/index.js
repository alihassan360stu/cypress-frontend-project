import React, { useState } from 'react';
import { Box, Divider, Fab, Tooltip, Typography, } from '@material-ui/core';
import { blue, green, grey, orange, red } from '@material-ui/core/colors';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import RootFolder from './RootFolder';
import ChildFolder from './ChildFolder';
import GroupModule from "./GroupModule"
import "react-virtualized/styles.css";
import { Edit, FileCopy, Delete, Add } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import AddNew from './AddNew';
import UpdateGroup from './UpdateGroup';
import HomeIcon from '@material-ui/icons/Home';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Axios from 'axios';
const MySwal = withReactContent(Swal);
const breadcrumbs = [];
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
const ListAll = (props) => {
  const [dialogState, setDialogState] = useState(initialDialogState);
  const [refereshData, setRefereshData] = useState(false);
  const [showCreateDial, setShowCreateDial] = useState(false);
  const [getReactTableRef, setGetReactTableRef] = useState(null);
  const [routing, setRouting] = useState(["root", 0, 0]);
  const [rootData, setRootData] = useState([])
  const [rootRow, setRootRow] = useState([])
  const [settingChild, setSettingChild] = useState(undefined)
  const [childGroupData, setChildGroupData] = useState([])
  const [groupModuleData, setGroupModuleData] = useState([])
  const [changeRoutingState, setChangeRoutingState] = useState(undefined)
  const [showFabIcon, setShowFabIcon] = useState([])
  const [showEdit , setShowEdit]=useState(false);



  if (dialogState.refreshData) {
    getReactTableRef.onQueryChange()
    setDialogState(prevState => ({ ...prevState, refreshData: false }))
  }
  if (refereshData) {
    getReactTableRef.onQueryChange()
    setRefereshData(false);
  }
  const showMessage = (icon, text) => {
    Toast.fire({
      icon,
      title: text
    });
  }

  const routerOfReactTable = () => {
    if (routing[0] === "root") {
      return (
        <RootFolder getReff={(ref) => { setGetReactTableRef(ref) }}
          getData={(data) => { setRootData(data) }}
          getRow={(data) => { setRootRow(data);setShowFabIcon([data])}}
          changRout={(data) => { setRouting([0, data, 0]);setChangeRoutingState(data)}}
        />
      )
    }
    if (routing[1] === "child") {
      return (
        <ChildFolder getReff={(ref) => { setGetReactTableRef(ref) }}
          parentData={rootRow}
          getRow={(data) => { setChildGroupData(data);setShowFabIcon([data])}}
          changRout={(data) => { setRouting([0, 0, data]);setSettingChild(data)}}
        />)
    }

    if (routing[2] === "module") {
      return (
        <GroupModule getReff={(ref) => { setGetReactTableRef(ref) }}
          parentData={rootRow}
          getRow={(data) => { setGroupModuleData(data) }}
        // changRout={(data) => { setRouting([0,0,data]) }}
        />)
    }
  }

  const deleteCall = (data) => {
    return new Promise((resolve, reject) => {
      Axios.post('/group/delete', data).then(ans => {
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

  const deleteRowClick = async () => {
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
          console.log("api data is now ",showFabIcon[0]._id)
          const result = await deleteCall({group_id:showFabIcon[0]._id})
          MySwal.fire('Success', result, 'success');
          setRefereshData(true)
        } catch (e) {
          MySwal.fire('Error', e, 'error');
        }
      }
    });
  }





  return (
    <div>
      <PageContainer heading="" breadcrumbs={breadcrumbs}>
        <Box display='flex' flexDirection='row' justifyContent='end'>
          
          {
            showFabIcon.length!==0 && <Box display={"flex"} width="25%" justifyContent="space-evenly">
            <Tooltip title={"Edit Group"}>
              <Fab size="small" color="default" aria-label="add" onClick={() => { setShowEdit(true) }} >
                <Edit style={{ color: "blue" }} />
              </Fab>
            </Tooltip>
            <Tooltip title={"Delete group"}>
              <Fab size="small" color="default" aria-label="add" onClick={() => {deleteRowClick() }} >
                <Delete style={{ color: "red" }}/>
              </Fab>
            </Tooltip>
            <Tooltip title={"Clone"}>
              <Fab size="small" color="default" aria-label="add" onClick={() => { setShowCreateDial(true) }} >
                <FileCopy style={{ color: "blue" }} />
              </Fab>
            </Tooltip>
          </Box>
          }

          <Tooltip title={"Create New Group"}>
            <Fab size="small" color="default" aria-label="add" onClick={() => { setShowCreateDial(true) }} >
              <Add />
            </Fab>
          </Tooltip>
        </Box>
        <br />

        <Box display="flex" alignItems="center" height="100%">
          {
            changeRoutingState !== undefined && <>
              <HomeIcon onClick={() => {
                setRouting(["root", 0, 0])
                setChangeRoutingState(undefined);
                setSettingChild(undefined)
                setShowFabIcon([])
              }}
                style={{ fontSize: "2rem", cursor: "pointer", color: "blue", marginRight: "1%" }} />
              <Typography variant='body1' style={{ marginRight: "1%", color: "blue", cursor: "pointer" }} onClick={() => {
                setRouting(["root", 0, 0])
                setChangeRoutingState(undefined);
                setSettingChild(undefined)
                setShowFabIcon([])
              }}>
                {changeRoutingState}</Typography>
            </>
          }
          {
            settingChild!== undefined && (<>
              <ArrowForwardIosIcon style={{ fontSize: "1.5rem", cursor: "pointer", color: "blue", marginRight: "1%" }} />
              <Typography variant='body1' style={{ marginRight: "1%", color: "blue", cursor: "pointer", marginRight: "1%" }} onClick={() => {
                setRouting([0, "child", 0])
                setSettingChild(undefined)
                setShowFabIcon([])
              }}>
                {childGroupData.name}</Typography>

            </>
            )
          }
        </Box>

        <br />
 
        <br />
        {
          routerOfReactTable()
        }
        {/* <MaterialTable
          tableRef={tableRef}
          icons={tableIcons}
          title="Group List"
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
        /> */}
        {showCreateDial && <AddNew hideDialog={setShowCreateDial} setRefereshData={setRefereshData} parentData={rootData} />}
        {showEdit && <UpdateGroup hideDialog={setShowEdit} setRefereshData={setRefereshData} parentData={rootData} />}
        

        {/* {showDuplicate && <Duplicate hideDialog={setShowDuplicate} setRefereshData={setRefereshData} rowData={rowData} />} */}
      </PageContainer>
      {/* } */}
    </div>
  );
};

export default (withStyles({}, { withTheme: true })(ListAll));

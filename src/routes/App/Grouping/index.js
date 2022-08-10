import React, { useState, forwardRef, createRef } from 'react';
import { MenuList, Paper, Popover } from '@material-ui/core';
import { Divider, Box, Button,MenuItem  } from '@material-ui/core';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import { lighten, makeStyles, alpha } from '@material-ui/core/styles';
import { blue, green, grey, orange, red } from '@material-ui/core/colors';
import MaterialTable from '@material-table/core';
import { withStyles } from '@material-ui/styles';
import MoveToInboxSharpIcon from '@material-ui/icons/MoveToInboxSharp';
import {
  AddBox, ArrowDownward, Check, ChevronLeft,
  ChevronRight, Clear, DeleteOutline, Edit,
  FilterList, FirstPage, LastPage, Remove, SaveAlt, Search, ViewColumn,
  MoreVert, FileCopy, ControlPointDuplicate, Delete, PlayArrow, Close
}
  from '@material-ui/icons';

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

// import { DataArrayTwoTone } from '@mui/icons-material';

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


const Grouping = (props) => {
  const { theme } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [rowData, setRowData] = useState(undefined);
  const [moreOptions, setMoreOptions] = useState([]);
  const open = Boolean(anchorEl);

  var columns = [
    { title: "S#", field: "id" },
    { title: "Group name", field: "name" },
    { title: "OWNER", field: "owner" },
    { title: "KIND", field: "kind" },
    { title: "STATUS", field: "status" },
    { title: "LAST RUN", field: "lastRun" },


  ]

  var data = [
    {
      id: "1",
      name: "google",
      owner: "sundar",
      kind: "folder",
      status: "select",
      lastRun: "two day ago"
    },
    {
      id: "2",
      name: "programmmer",
      owner: "goooood",
      kind: "test case",
      status: "select",
      lastRun: "today"
    },
    {
      id: "3",
      name: "designer",
      owner: "hassan raza",
      kind: "folder",
      status: "select",
      lastRun: "yesterday"
    },
  ];


  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const handlePopoverOpen = (event, rowData) => {
    setMoreOptionsByRowData(rowData)
    setAnchorEl(event.currentTarget);
  };


  const setMoreOptionsByRowData = (row) => {
    const tempData = [];
    tempData.push(
      <MenuItem onClick={(e) => {
        handlePopoverClose()
      }}>
        <PlayArrow style={{color:"green"}}/> &nbsp; Run Test
      </MenuItem>
    )

    tempData.push(
      <MenuItem onClick={(e) => {
        handlePopoverClose()
        setRowData(row)
      }}>
        <FileCopy /> &nbsp; Duplicate
      </MenuItem>
    )
    tempData.push(
      <MenuItem onClick={(e) => {
        handlePopoverClose()
        setRowData(row)
      }}>
        <Edit /> &nbsp; Edit
      </MenuItem>
    )
    tempData.push(
      <MenuItem onClick={(e) => {
        handlePopoverClose()
        setRowData(row)
      }}>
        <Delete style={{color:"red"}}/> &nbsp; Delete
      </MenuItem>
    )

    tempData.push(
      <MenuItem onClick={(e) => {
        handlePopoverClose()
        setRowData(row)
      }}>
        <MoveToInboxSharpIcon /> &nbsp; Move to
      </MenuItem>)
    setMoreOptions(tempData);
  }




























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

  const classes = useStyles();

  return (
    <PageContainer>
      <div>
        <Box className={classes.pageTitle} fontSize={{ xs: 30, sm: 30 }}>
          Grouping
        </Box>
      </div>
      <Divider />
      <br />
      <Box display='flex' flexDirection='row' justifyContent='end'>
        <Button type='button' variant="contained" color="primary" onClick={() => { }}>
          Create New Group
        </Button>
      </Box>
      <br />
      <MaterialTable
        title="Grouping"
        // tableRef={tableRef}
        icons={tableIcons}
        columns={columns}
        data={data}
        actions={actions}

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
          showFirstLastPageButtons: true,
          pageSize: data.length > 10 ? 12 : data.length,
          padding: 'default',
          pageSizeOptions: [20, 50, 100],
        }}
      />
      <br />

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

    </PageContainer>


  );
};

export default (withStyles({}, { withTheme: true })(Grouping));

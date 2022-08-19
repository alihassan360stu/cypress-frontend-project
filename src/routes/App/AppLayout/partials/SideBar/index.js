import React, { useState } from 'react';

import PerfectScrollbar from 'react-perfect-scrollbar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useSelector } from 'react-redux';
import CmtVertical from '@coremat/CmtNavigation/Vertical';
import { menusFull, menusLess } from '../menus';
import { useEffect } from 'react';


const useStyles = makeStyles(() => ({
  perfectScrollbarSidebar: {
    height: '100%',
    transition: 'all 0.3s ease',
    '.Cmt-sidebar-fixed &, .Cmt-Drawer-container &': {
      height: 'calc(100% - 167px)',
    },
    '.Cmt-modernLayout &': {
      height: 'calc(100% - 72px)',
    },
    '.Cmt-miniLayout &': {
      height: 'calc(100% - 91px)',
    },
    '.Cmt-miniLayout .Cmt-sidebar-content:hover &': {
      height: 'calc(100% - 167px)',
    },
  },
}));

const SideBar = () => {
  const classes = useStyles();
  const orgs = useSelector(({ orgs }) => orgs);
  const [menus, setMenus] = useState(menusLess)

  useEffect(() => {
    setTimeout(() => {
      if (orgs && orgs.length > 0) {
        setMenus(menusFull)
      } else {
        setMenus(menusLess)
      }
    }, 500);
  }, [orgs])

  return (
    <PerfectScrollbar className={classes.perfectScrollbarSidebar}>
      <CmtVertical menuItems={menus} />
    </PerfectScrollbar>
  );
};

export default SideBar;

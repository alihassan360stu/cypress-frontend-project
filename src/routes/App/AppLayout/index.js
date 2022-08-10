import React, { useEffect, useState } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';
import globalStyles from '../../../theme/GlobalCss';
import { useDispatch, useSelector } from 'react-redux';
import VerticalDefault from './VerticalLayouts/VerticalDefault';

const useStyles = makeStyles(() => ({
  circularProgressRoot: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const AppLayout = ({ children }) => {
  const [showLayoutLoader, setLayoutLoader] = useState(true);
  const { loadUser } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const classes = useStyles();
  globalStyles();

  useEffect(() => {
    // dispatch(AuhMethods[CurrentAuthMethod].getAuthUser());
    setLayoutLoader(false);
  }, [dispatch]);

  if (showLayoutLoader || !loadUser) {
    return (
      <div className={classes.circularProgressRoot}>
        <CircularProgress />
      </div>
    );
  }

  return <VerticalDefault children={children} />;
};

export default AppLayout;

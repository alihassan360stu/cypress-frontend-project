import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import GridContainer from '@jumbo/components/GridContainer';
import { useSelector } from 'react-redux';

import Total from './Total'
import Failed from './Failed'
import Success from './Success'
import Stopped from './Stopped'
import Axios from 'axios';
import { useState } from 'react';

const initialState = {
  total: 0,
  pass: 0,
  failed: 0,
}

const NewsDashboard = () => {

  const xs = 6, sm = 6, xl = 10, md = 3, lg = 3;
  const [state, setState] = useState(initialState);
  const [notTested, setNotTested] = useState(0);

  useEffect(() => {
    let { total, pass, failed } = state;
    if (total > (pass + failed)) {
      setNotTested(total - (pass + failed))
    }
  }, [state])

  return (
    <GridContainer>
      <Grid item xs={xs} sm={sm} xl={xl} md={md} lg={lg}>
        <Total setState={setState} />
      </Grid>
      <Grid item xs={xs} sm={sm} xl={xl} md={md} lg={lg}>
        <Success setState={setState} />
      </Grid>
      <Grid item xs={xs} sm={sm} xl={xl} md={md} lg={lg}>
        <Failed setState={setState} />
      </Grid>
      <Grid item xs={xs} sm={sm} xl={xl} md={md} lg={lg}>
        <Stopped data={notTested} />
      </Grid>
    </GridContainer>
  );
};

export default NewsDashboard;

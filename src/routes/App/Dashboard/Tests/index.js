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
  blocked: 0,
  active: 0
}

const NewsDashboard = () => {
  const xs = 6, sm = 6, xl = 10, md = 3, lg = 3;
  const { authUser } = useSelector(({ auth }) => auth);
  const [data, setData] = useState(initialState);

  // const loadData = () => {
  //   try {
  //     Axios.post(authUser.api_url + '/dash-get-normal-users')
  //       .then(ans => {
  //         ans = ans.data;
  //         if (ans.status) {
  //           setData(ans.data);
  //         }
  //       })
  //       .catch(e => { });
  //   } catch (e) { }
  // };

  // useEffect(() => {
  //   loadData();
  // }, []);

  return (
    <GridContainer>
      <Grid item xs={xs} sm={sm} xl={xl} md={md} lg={lg}>
        <Total data={data.total} />
      </Grid>
      <Grid item xs={xs} sm={sm} xl={xl} md={md} lg={lg}>
        <Success data={data.active} />
      </Grid>
      <Grid item xs={xs} sm={sm} xl={xl} md={md} lg={lg}>
        <Failed data={data.blocked} />
      </Grid>
      <Grid item xs={xs} sm={sm} xl={xl} md={md} lg={lg}>
        <Stopped data={data.blocked} />
      </Grid>
    </GridContainer>
  );
};

export default NewsDashboard;

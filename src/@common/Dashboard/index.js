import React from 'react';
import { Divider, Grid, Typography } from '@material-ui/core';
import GridContainer from '@jumbo/components/GridContainer';

import TotalEmps from './TotalEmps';
import TotalActiveEmps from './TotalActiveEmps';
import TotalInActiveEmps from './TotalInActiveEmps';

import EmpsThisYear from './EmpsThisYear';
import EmpsThisMonth from './EmpsThisMonth';
import EmpsThisDay from './EmpsThisDay';
import YearWiseChart from './YearWiseChart';

import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import moment from 'moment';
import { TotalVericiationsClear, TotalVericiationsNotClear, TotalVerifications } from './Verifications';


const NewsDashboard = () => {
  return (
    <PageContainer heading="Dashboard">
      <Divider />
      <br />
      <Typography variant="h4" color="textPrimary">
        Employees Statistics
      </Typography>
      <br />
      <GridContainer>
        <Grid item xs={12} sm={6} xl={4}>
          <TotalEmps />
        </Grid>
        <Grid item xs={12} sm={6} xl={4}>
          <TotalActiveEmps />
        </Grid>
        <Grid item xs={12} sm={6} xl={4}>
          <TotalInActiveEmps />
        </Grid>
      </GridContainer>

      <br />
      <Typography variant="h4" color="textPrimary">
        Employees Verified
      </Typography>
      <br />
      <GridContainer>
        <Grid item xs={12} sm={6} xl={4}>
          <EmpsThisYear />
        </Grid>
        <Grid item xs={12} sm={6} xl={4}>
          <EmpsThisMonth />
        </Grid>
        <Grid item xs={12} sm={6} xl={4}>
          <EmpsThisDay />
        </Grid>
      </GridContainer>
      <br />
      <Typography variant="h4" color="textPrimary">
        Verifications Statistics
      </Typography>
      <br />
      <GridContainer>
        <Grid item xs={12} sm={6} xl={4}>
          <TotalVerifications />
        </Grid>
        <Grid item xs={12} sm={6} xl={4}>
          <TotalVericiationsClear />
        </Grid>
        <Grid item xs={12} sm={6} xl={4}>
          <TotalVericiationsNotClear />
        </Grid>
      </GridContainer>
      <br />
      <Typography variant="h4" color="textPrimary">
        Employees Verified Month Wise Graph For Year {moment().format('yyyy')}
      </Typography>
      <br />
      <YearWiseChart />
    </PageContainer>
  );
};

export default NewsDashboard;

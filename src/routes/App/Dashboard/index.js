import React from 'react';
import { Divider, Grid, Typography } from '@material-ui/core';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Tests from './Tests'
import YearWiseChart from './YearWiseChart'
import moment from 'moment';

const NewsDashboard = () => {
  return (
    <PageContainer heading={`Dashboard`}>
      <Divider />
      <br />
      <Typography variant="h4" color="textPrimary">
        Tests Run Statistics
      </Typography>
      <br />
      <Tests />
      <br />
      <Typography variant="h4" color="textPrimary">
        Year Wise Test Runs {moment().utc().local().format('YYYY')}
      </Typography>
      <br />
      <YearWiseChart />
    </PageContainer>
  );
};

export default NewsDashboard;

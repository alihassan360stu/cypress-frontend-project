import React from 'react';
import { Divider, Grid, Typography } from '@material-ui/core';
import PageContainer from '@jumbo/components/PageComponents/layouts/PageContainer';
import Tests from './Tests'
import YearWiseChart from './YearWiseChart'

const NewsDashboard = () => {
  return (
    <PageContainer heading={`Dashboard`}>
      <Divider />
      <br />
      <Typography variant="h3" color="textPrimary">
        Tests
      </Typography>
      <br />
      <Tests />
      <br />
      <Typography variant="h3" color="textPrimary">
        Year Wise Graph
      </Typography>
      <br />
      <YearWiseChart />
    </PageContainer>
  );
};

export default NewsDashboard;

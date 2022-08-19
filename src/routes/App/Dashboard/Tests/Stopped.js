import React from 'react';
import { Group } from '@material-ui/icons';
import HoverInfoCard from './HoverInfoCard';

const Widget = ({ data }) => {
  return (
    <HoverInfoCard
      icon={<Group style={{ color: '#ffffff', fontSize: 30 }} />}
      backgroundColor="#061fbe"
      title={data}
      counterProps={{ duration: 1 }}
      subTitle={`Not Tested Yet`}
      showArrow={false}
    />
  );
};

export default Widget;

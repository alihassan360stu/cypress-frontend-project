import React from 'react';
import { Group } from '@material-ui/icons';
import HoverInfoCard from '@jumbo/components/Common/HoverInfoCard';

const Widget = ({ data }) => {
  return (
    <HoverInfoCard
      icon={<Group style={{ color: '#ffffff', fontSize: 30 }} />}
      backgroundColor="#a70505"
      title={data}
      counterProps={{ duration: 1 }}
      subTitle={`Failed Tests`}
      showArrow={false}
      linkOnArrow={`assoc`}
    />
  );
};

export default Widget;

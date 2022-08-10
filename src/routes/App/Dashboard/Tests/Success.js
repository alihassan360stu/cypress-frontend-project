import React from 'react';
import { Group } from '@material-ui/icons';
import HoverInfoCard from '@jumbo/components/Common/HoverInfoCard';

const Widget = ({ data }) => {
  return (
    <HoverInfoCard
      icon={<Group style={{ color: '#ffffff', fontSize: 30 }} />}
      backgroundColor="#04ca49"
      title={data}
      counterProps={{ duration: 1 }}
      subTitle={`Success`}
      showArrow={false}
      linkOnArrow={`assoc`}
    />
  );
};

export default Widget;

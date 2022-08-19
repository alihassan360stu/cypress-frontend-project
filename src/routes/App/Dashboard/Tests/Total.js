import React, { useState } from 'react';
import { Group } from '@material-ui/icons';
import HoverInfoCard from './HoverInfoCard';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const Widget = ({ setState }) => {
  const [data, setData] = useState(0)
  const org = useSelector(({ org }) => org)

  const loadData = () => {
    try {
      axios.post('/dashboard', { org_id: org._id, type: 1 })
        .then(ans => {
          ans = ans.data;
          if (ans.status) {
            setData(ans.total);
            setState(prevState => ({ ...prevState, total: ans.total }));
          }
        })
        .catch(e => { });
    } catch (e) { }
  };

  useEffect(() => {
    loadData();
  }, [org]);

  return (
    <HoverInfoCard
      icon={<Group style={{ color: '#ffffff', fontSize: 30 }} />}
      backgroundColor="#7d0379"
      title={data}
      counterProps={{ duration: 1 }}
      subTitle={`All Tests`}
      showArrow={false}
      linkOnArrow={`assoc`}
    />
  );
};

export default Widget;

import React, { useState } from 'react';
import { Group } from '@material-ui/icons';
import HoverInfoCard from './HoverInfoCard';
import axios from 'axios';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Widget = ({ setState }) => {
  const [data, setData] = useState(0)
  const org = useSelector(({ org }) => org)

  const loadData = () => {
    try {
      axios.post('/dashboard', { org_id: org._id, type: 2 })
        .then(ans => {
          ans = ans.data;
          if (ans.status) {
            setData(ans.total);
            setState(prevState => ({ ...prevState, pass: ans.total }));
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

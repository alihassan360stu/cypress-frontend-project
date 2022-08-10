import React, { useEffect, useState } from 'react';
import Functions from '@material-ui/icons/Functions';
import HoverInfoCard from '@jumbo/components/Common/HoverInfoCard';
import { useSelector } from 'react-redux';
import Axios from 'axios';

const Widget = () => {
  const [data, setData] = useState(0);
  const { authUser } = useSelector(({ auth }) => auth);

  const loadData = () => {
    try {
      Axios.post(authUser.api_url + '/emp/countall')
        .then(ans => {
          ans = ans.data;
          if (ans.status) {
            setData(ans.data.total);
          }
        })
        .catch(e => {});
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <HoverInfoCard
      icon={<Functions style={{ color: '#ffffff', fontSize: 40 }} />}
      backgroundColor="#6a329f"
      title={data}
      counterProps={{ duration: 1 }}
      subTitle="Total Employees"
    />
  );
};

export default Widget;

import React, { useEffect, useState } from 'react';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import HoverInfoCard from '@jumbo/components/Common/HoverInfoCard';
import { useSelector } from 'react-redux';
import Axios from 'axios';

const Widget = () => {
  const [data, setData] = useState(0);
  const { authUser } = useSelector(({ auth }) => auth);

  const loadData = () => {
    try {
      Axios.post(authUser.api_url + '/emp/count', { is_employeed: 0 })
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
      icon={<WbSunnyIcon style={{ color: '#ffffff' }} />}
      backgroundColor="#dc7411"
      title={data}
      counterProps={{ duration: 1 }}
      subTitle="InActive Employees"
      showArrow={true}
      linkOnArrow={'emps/inactive'}
    />
  );
};

export default Widget;

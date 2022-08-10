import React, { useEffect, useState } from 'react';
import ContactMail from '@material-ui/icons/ContactMail';
import HoverInfoCard from '@jumbo/components/Common/HoverInfoCard';
import { useSelector } from 'react-redux';
import Axios from 'axios';

const Widget = () => {
  const [data, setData] = useState(0);
  const { authUser } = useSelector(({ auth }) => auth);

  const loadData = () => {
    try {
      Axios.post(authUser.api_url + '/emp/count', { is_employeed: 1 })
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
      icon={<ContactMail style={{ color: '#ffffff' }} />}
      backgroundColor="#0e33a7"
      title={data}
      counterProps={{ duration: 1 }}
      subTitle="Active Employees"
      showArrow={true}
      linkOnArrow={'emps/active'}
    />
  );
};

export default Widget;

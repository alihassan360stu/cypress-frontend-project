import React, { useEffect, useState } from 'react';
import { PersonAddTwoTone } from '@material-ui/icons';
import HoverInfoCard from '@jumbo/components/Common/HoverInfoCard';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import moment from 'moment';

const Widget = () => {
  const [data, setData] = useState(0);
  const { authUser } = useSelector(({ auth }) => auth);

  const loadData = () => {
    try {
      Axios.post(authUser.api_url + '/emp/countthismonth')
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
      icon={<PersonAddTwoTone style={{ color: '#ffffff', fontSize: 30 }} />}
      backgroundColor="#0e33a7"
      title={data}
      counterProps={{ duration: 1 }}
      subTitle={`In Month Of ${moment().format('MMMM')}`}
    />
  );
};

export default Widget;

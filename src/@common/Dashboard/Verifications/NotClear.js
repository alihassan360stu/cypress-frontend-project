import React, { useEffect, useState } from 'react';
import { Cancel } from '@material-ui/icons';
import HoverInfoCard from '@jumbo/components/Common/HoverInfoCard';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import moment from 'moment';

const Widget = () => {
  const [data, setData] = useState(0);
  const { authUser } = useSelector(({ auth }) => auth);

  const loadData = () => {
    try {
      Axios.post(authUser.api_url + '/emp/verifications', { status: 1 })
        .then(ans => {
          ans = ans.data;
          if (ans.status) {
            setData(ans.data.total);
          }
        })
        .catch(e => { });
    } catch (e) { }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <HoverInfoCard
      icon={<Cancel style={{ color: '#ffffff', fontSize: 30 }} />}
      backgroundColor="#C70039"
      title={data}
      counterProps={{ duration: 1 }}
      subTitle={`Not Clear`}
    // showArrow={true}
    // linkOnArrow={'disp/pending'}
    />
  );
};

export default Widget;

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const SiteTrafficGraph = () => {
  const [dataSet, setDataSet] = useState([]);
  const [dataSetInActive, setDataSetInActive] = useState([]);
  const { authUser } = useSelector(({ auth }) => auth);

  const loadData = () => {
    try {
      Axios.post(authUser.api_url + '/emp/yearstatsactive')
        .then(ans => {
          ans = ans.data;
          if (ans.status) {
            var tDataSet = [];
            ans.data.map(row => {
              tDataSet.push(row.total);
            });
            setDataSet(tDataSet);
            loadInActiveData();
          }
        })
        .catch(e => { });
    } catch (e) { }
  };

  const loadInActiveData = () => {
    try {
      Axios.post(authUser.api_url + '/emp/yearstatsinactive')
        .then(ans => {
          ans = ans.data;
          if (ans.status) {
            var tDataSet = [];
            ans.data.map(row => {
              tDataSet.push(row.total);
            });
            setDataSetInActive(tDataSet);
          }
        })
        .catch(e => { });
    } catch (e) { }
  };

  useEffect(() => {
    loadData();
  }, []);

  const data = canvas => {
    const ctx = canvas.getContext('2d');
    const _stroke = ctx.stroke;

    ctx.stroke = function () {
      ctx.save();
      ctx.shadowColor = '#4C4C4C';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      _stroke.apply(this, arguments);
      ctx.restore();
    };

    return {
      labels: ['January', 'Faburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          label: 'Employees',
          data: dataSet,
          borderColor: '#7F39FB',
          borderWidth: 2,
          pointBackgroundColor: '#7F39FB',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#7F39FB',
          pointHoverBorderColor: '#fff',
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: false,
        },
        {
          label: 'InActive Employees',
          data: dataSetInActive,
          borderColor: '#FF8C00',
          borderWidth: 2,
          pointBackgroundColor: '#FF8C00',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#FF8C00',
          pointHoverBorderColor: '#fff',
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: false,
        },
      ],
    };
  };

  const options = {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          display: true,
          ticks: {
            suggestedMax: 100,
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return <Line data={data} height={100} options={options} />;
};

export default SiteTrafficGraph;

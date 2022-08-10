import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const SiteTrafficGraph = () => {
  // const [dataSet, setDataSet] = useState([]);
  // const [dataSetInActive, setDataSetInActive] = useState([]);
  // const { authUser } = useSelector(({ auth }) => auth);

  // const loadData = () => {
  //   try {
  //     Axios.post(authUser.api_url + '/emp/yearstatsactive')
  //       .then(ans => {
  //         ans = ans.data;
  //         if (ans.status) {
  //           var tDataSet = [];
  //           ans.data.map(row => {
  //             tDataSet.push(row.total);
  //           });
  //           setDataSet(tDataSet);
  //           loadInActiveData();
  //         }
  //       })
  //       .catch(e => { });
  //   } catch (e) { }
  // };

  // const loadInActiveData = () => {
  //   try {
  //     Axios.post(authUser.api_url + '/emp/yearstatsinactive')
  //       .then(ans => {
  //         ans = ans.data;
  //         if (ans.status) {
  //           var tDataSet = [];
  //           ans.data.map(row => {
  //             tDataSet.push(row.total);
  //           });
  //           setDataSetInActive(tDataSet);
  //         }
  //       })
  //       .catch(e => { });
  //   } catch (e) { }
  // };

  // useEffect(() => {
  //   loadData();
  // }, []);

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


    const datasets = [];
    const temp_set = [
      {
        color: '#7d0379', title: 'Total',
        counts: [
          1000, 400, 223, 11, 9, 200, 900, 500, 440, 800, 1000, 1110
        ]
      },
      {
        color: '#04ca49', title: 'Success', counts: [
          800, 100, 123, 6, 2, 80, 700, 300, 340, 640, 750, 910
        ]
      },
      {
        color: '#a70505', title: 'Failed', counts: [
          50, 40, 23, 2, 1, 20, 400, 200, 140, 340, 100, 210
        ]
      },
      {
        color: '#061fbe', title: 'Stopped', counts: [
          5, 4, 33, 1, 0, 10, 40, 10, 50, 140, 70, 110
        ]
      },
    ]

    temp_set.map(item => {
      datasets.push({
        label: item.title,
        data: item.counts,
        borderColor: item.color,
        borderWidth: 2,
        pointBackgroundColor: item.color,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#7F39FB',
        pointHoverBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: false,
      })
    })

    return {
      labels: ['January', 'Faburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets
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

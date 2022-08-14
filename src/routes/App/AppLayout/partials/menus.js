import React from 'react';

import {
  ListAlt,
  Edit,
  ArrowForward,
  Speed,
  GroupWorkSharp,
  Group,
  Apartment,
  BarChart,
  Settings

} from '@material-ui/icons';

const defaultRoute = '/app/';

export const menusFull = [
  {
    name: '',
    type: 'section',
    children: [
      {
        name: 'Insight',
        type: 'item',
        icon: <BarChart />,
        link: `${defaultRoute}dashboard`,
      },
      {
        name: 'Organizations',
        type: 'item',
        icon: <Apartment />,
        link: `${defaultRoute}orgs`,
      },
      {
        name: 'Groups',
        icon: <GroupWorkSharp />,
        type: 'item',
        link: `${defaultRoute}groups`,
      },
      {
        name: 'Editor',
        type: 'collapse',
        children: [{}],
        icon: <Edit />,
        // link: `${defaultRoute}editor`,
      },
      {
        name: 'Tests',
        icon: <ListAlt />,
        type: 'item',
        link: `${defaultRoute}tests`
      },
      {
        name: 'Runs',
        icon: <Speed />,
        type: 'item',
        link: `${defaultRoute}runs`,
      },
      {
        name: 'Settings',
        type: 'item',
        icon: <Settings />,
        link: `${defaultRoute}settings`,
      },
    ],
  },
];


export const menusLess = [
  {
    name: 'Organizations',
    type: 'item',
    icon: <Apartment />,
    link: `${defaultRoute}orgs`,
  },
];
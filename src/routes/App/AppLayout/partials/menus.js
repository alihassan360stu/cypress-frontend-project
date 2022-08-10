import React from 'react';
import {
  ListAlt,
  Edit,
  ArrowForward,
  Speed,
  GroupWorkSharp,
  Group,
  BarChart,
  Settings,

} from '@material-ui/icons';
import GroupIcon from '@material-ui/icons/Group';

const defaultRoute = '/app/';

export const sidebarNavs = [
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
        name: 'Editor',
        type: 'item',
        icon: <Edit />,
        link: `${defaultRoute}editor`,
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
        name: 'Groups',
        icon: <GroupWorkSharp />,
        type: 'collapse',
        children: [
          {
            name: 'Create New',
            icon: <ArrowForward />,
            type: 'item',
            link: `${defaultRoute}group/add`,
          },
          {
            name: 'List All',
            icon: <ArrowForward />,
            type: 'item',
            link: `${defaultRoute}groups`,
          },
        ],
      },
      {
        name: 'grouping',
        type: 'item',
        icon: <GroupIcon/>,
        link: `${defaultRoute}grouping`,
      },
      {
        name: 'Settings',
        type: 'item',
        icon: <Settings />,
        link: `${defaultRoute}settings`,
      },
      // {
      //   name: 'Users',
      //   icon: <Group />,
      //   type: 'collapse',
      //   children: [
      //     {
      //       name: 'Create New',
      //       icon: <ArrowForward />,
      //       type: 'item',
      //       link: `${defaultRoute}user/add`,
      //     },
      //     {
      //       name: 'List All',
      //       icon: <ArrowForward />,
      //       type: 'item',
      //       link: `${defaultRoute}users`,
      //     },
      //   ],
      // },
    ],
  },
];
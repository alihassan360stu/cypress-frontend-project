import React, { lazy, Suspense, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import AppLayout from './AppLayout';
import Dashboard from './Dashboard'
import { AddTest, ListTests } from './Tests'
import { ListOrgs } from './Organizations'
import { ListGroups } from './Groups'
import UnderConstruction from './UnderConstruction';
import { useEffect } from 'react';

const Routes = () => {
  const requestedUrl = '/app/'
  const orgs = useSelector(({ orgs }) => orgs);
  const [routes, setRoutes] = useState([])

  const getRoutes = () => {
    setTimeout(() => {
      let tempRoutes = []
      if (orgs.length > 0) {
        tempRoutes.push(<Route path={requestedUrl + `dashboard`} component={Dashboard} />)
        tempRoutes.push(<Route path={requestedUrl + `settings`} component={UnderConstruction} />)
        tempRoutes.push(<Route path={requestedUrl + `editor`} component={UnderConstruction} />)
        tempRoutes.push(<Route path={requestedUrl + `tests`} component={ListTests} />)
        tempRoutes.push(<Route path={requestedUrl + `runs`} component={UnderConstruction} />)
        tempRoutes.push(<Route path={requestedUrl + `groups`} component={ListGroups} />)
      }

      setRoutes(tempRoutes)
    }, 500);
  }

  useEffect(() => {
    getRoutes();
  }, [])

  return (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          {routes}
          <Route path={requestedUrl + `orgs`} component={ListOrgs} />
          <Route component={lazy(() => import('../Pages/404'))} />
        </Switch>
      </Suspense>
    </AppLayout>
  );
};

export default withRouter(Routes);

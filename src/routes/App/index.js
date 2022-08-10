import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import PageLoader from '@jumbo/components/PageComponents/PageLoader';
import AppLayout from './AppLayout';
import Dashboard from './Dashboard'
import { AddTest, ListTests } from './Tests'
import { AddGroup, ListGroups } from './Groups'
import UnderConstruction from './UnderConstruction';
import Grouping from "./Grouping"

const Routes = () => {
  const requestedUrl = '/app/'

  return (
    <AppLayout>
      <Suspense fallback={<PageLoader />}>
        <Switch>

          <Redirect exact from={requestedUrl} to={requestedUrl + `/app/dashboard`} />
          <Route path={requestedUrl + `dashboard`} component={Dashboard} />
          {/* <Route path={requestedUrl + `user/add`} component={UnderConstruction} /> */}
          {/* <Route path={requestedUrl + `users`} component={UnderConstruction} /> */}
          <Route path={requestedUrl + `settings`} component={UnderConstruction} />
          <Route path={requestedUrl + `editor`} component={UnderConstruction} />
          {/* <Route path={requestedUrl + `test/add`} component={AddTest} /> */}
          <Route path={requestedUrl + `tests`} component={ListTests} />
          <Route path={requestedUrl + `grouping`} component={Grouping} />
          <Route path={requestedUrl + `runs`} component={UnderConstruction} />
          <Route path={requestedUrl + `group/add`} component={AddGroup} />
          <Route path={requestedUrl + `groups`} component={ListGroups} />
          <Route component={lazy(() => import('../Pages/404'))} />
        </Switch>
      </Suspense>
    </AppLayout>
  );
};

export default withRouter(Routes);

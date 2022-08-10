import React from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch, withRouter } from 'react-router';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Error404 from './Pages/404';
import Login from './Auth/Login';
import Register from './Auth/Register';
import App from './App';
import AxiosInterceptor from '@services/AxiosInterceptor';

const RestrictedRoute = ({ authUser, ...rest }) => {
  var Comp = undefined;
  if (authUser) {
    Comp = <App />;
  } else {
    sessionStorage.removeItem('cypress_user_1001');
  }

  return (
    <Route
      {...rest}
      render={props => {
        return Comp ? (
          Comp
        ) : (
          <Redirect
            to={{
              pathname: '/login/?action_url=' + window.location.pathname,
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

const Routes = () => {
  const { authUser } = useSelector(({ auth }) => auth);
  const match = useRouteMatch();

  return (
    <React.Fragment>
      <Switch>
        <Redirect to={'/login'} path="/" exact component={Login} />
        <Route path="/login/:id?" component={Login} />
        <Route path="/signup" component={Register} />

        <RestrictedRoute path={`${match.url}app`} authUser={authUser} />
        <Route component={Error404} />
      </Switch>
      <AxiosInterceptor />
    </React.Fragment>
  );
};

export default withRouter(Routes);

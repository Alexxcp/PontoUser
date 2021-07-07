import React, { Suspense, lazy } from 'react'
import { isAuthenticated } from "./auth";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { CircularProgress } from '@material-ui/core'

const Auth = lazy(() => import('./view/auth'));
const Register = lazy(() => import('./view/register'))
const Account = lazy(() => import('./view/account'))
const Home = lazy(() => import('./view/home'))

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );

const Routes = () => (
    <Router>
        <Suspense fallback={<div className="d-flex justify-content-center mt-5 pt-5"> <CircularProgress /> </div>}>
            <Switch>
                <PrivateRoute exact path="/home" component={Home} /> 
                <PrivateRoute exact path="/account/edit" component={Account} /> 
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Auth} />
                <Route exact path="/" component={Auth} />
            </Switch>
        </Suspense>
    </Router>
)

export default Routes;
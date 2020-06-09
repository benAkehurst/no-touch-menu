import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { PrivateRoute } from './hoc/PrivateRoute/PrivateRoute';
import ReactGA from 'react-ga';

import Layout from './hoc/Layout/Layout';
import Landing from './Containers/Landing/Landing';
import Auth from './Containers/Auth/Auth';
import Restaurant from './Containers/Restaurant/Restaurant';
import Admin from './Containers/Admin/Admin';

const history = createBrowserHistory();

history.listen((location) => {
  ReactGA.initialize('UA-146410390-3');
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <Switch>
            <Route path="/" exact component={Landing}></Route>
            <Route path="/auth" component={Auth}></Route>
            <PrivateRoute
              path="/restaurant"
              component={Restaurant}
            ></PrivateRoute>
            <PrivateRoute path="/admin" component={Admin}></PrivateRoute>
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;

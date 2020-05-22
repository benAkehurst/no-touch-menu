import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './hoc/PrivateRoute/PrivateRoute';

import Layout from './hoc/Layout/Layout';
import Auth from './Containers/Auth/Auth';
import Restaurant from './Containers/Restaurant/Restaurant';
import Admin from './Containers/Admin/Admin';

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <Switch>
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

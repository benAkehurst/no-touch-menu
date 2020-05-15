import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { PrivateRoute } from './hoc/PrivateRoute/PrivateRoute';

import Layout from './hoc/Layout/Layout';
import Auth from './Containers/Auth/Auth';
import Restaurant from './Containers/Restaurant/Restaurant';
import Profile from './Containers/Profile/Profile';
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
            <PrivateRoute path="/profile" component={Profile}></PrivateRoute>
            <PrivateRoute path="/admin" component={Admin}></PrivateRoute>
            <PrivateRoute path="/users" component={Admin}></PrivateRoute>
            <PrivateRoute path="/restaurants" component={Admin}></PrivateRoute>
            <PrivateRoute path="/menus" component={Admin}></PrivateRoute>
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;

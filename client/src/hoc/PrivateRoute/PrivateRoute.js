import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import helpers from '../../Helpers/localStorage';

/* eslint-disable */
export const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = helpers.getUserToken();
  return (
    <Route
      {...rest}
      render={(props) =>
        token !== undefined || null ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/auth',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

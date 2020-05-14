import React, { Component } from 'react';
import classes from './Admin.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../Helpers/localStorage';

class Admin extends Component {
  state = {
    isAdmin: false,
  };

  componentDidMount() {
    // here i need to call the server to check if a user is an admin,
    // if not bounce them to login
  }

  render() {
    return <div className={classes.Admin}>Admin</div>;
  }
}

export default withErrorHandler(Admin, axios);

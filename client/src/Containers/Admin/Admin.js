import React, { Component } from 'react';
import classes from './Admin.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../Helpers/localStorage';
import BASE_URL from '../../Helpers/BASE_URL';

import Spinner from '../../components/UI/Spinner/Spinner';

class Admin extends Component {
  state = {
    isAdmin: false,
    isLoading: false,
    isError: false,
    isAuthorised: false,
  };

  componentDidMount() {
    // here i need to call the server to check if a user is an admin,
    // if not bounce them to login
    this.setState({ isLoading: true });
    axios
      .get(`${BASE_URL}/admin/check-if-admin/${helpers.getUserId()}`)
      .then((res) => {
        if (res.data.data.success) {
          this.setState({ isLoading: false, isAuthorised: true });
        }
      })
      .catch((err) => {
        this.props.history.push({ pathName: '/auth' });
      });
  }

  render() {
    return <div className={classes.Admin}>Admin</div>;
  }
}

export default withErrorHandler(Admin, axios);

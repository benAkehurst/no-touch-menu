import React, { Component } from 'react';
import classes from './Admin.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../Helpers/localStorage';
import BASE_URL from '../../Helpers/BASE_URL';

import Aux from '../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Banner from '../../components/UI/Banner/Banner';
import Spinner from '../../components/UI/Spinner/Spinner';
import Uploader from '../../components/Uploader/Uploader';

class Admin extends Component {
  state = {
    isAdmin: false,
    isLoading: false,
    isError: false,
    isAuthorised: false,
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    if (helpers.getUserId() === null) {
      this.props.history.push({ pathName: '/auth' });
    }
    axios
      .get(`${BASE_URL}/admin/check-if-admin/${helpers.getUserId()}`)
      .then((res) => {
        if (res.data.data.success) {
          this.setState({ isLoading: false, isAuthorised: true });
        }
      })
      .catch((err) => {
        helpers.clearStorage();
        this.props.history.push({ pathName: '/auth' });
      });
  }

  render() {
    return (
      <Aux>
        <Banner siteName={'Admin Options'}></Banner>
        <main>
          <section>
            <h3>Admin Options</h3>
          </section>
          <section>
            <h3>Auth Options</h3>
          </section>
          <section>
            <h3>Restaurant Options</h3>
          </section>
          <section>
            <h3>Menu Options</h3>
          </section>
        </main>
      </Aux>
    );
  }
}

export default withErrorHandler(Admin, axios);

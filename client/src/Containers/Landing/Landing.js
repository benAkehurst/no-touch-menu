import React, { Component } from 'react';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import Aux from '../../hoc/Aux/Aux';
import Banner from '../../components/UI/Banner/Banner';
import Button from '@material-ui/core/Button';

class Landing extends Component {
  // google analytics

  // send email

  render() {
    return (
      <Aux>
        <Banner
          siteName={'No Touch Menu'}
          showUserButtons={false}
          showLogo={false}
          showLoginButton={true}
        ></Banner>
      </Aux>
    );
  }
}

export default withErrorHandler(Landing, axios);

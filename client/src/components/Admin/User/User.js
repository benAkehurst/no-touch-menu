import React, { Component } from 'react';
import classes from './User.module.scss';
import axios from '../../../axios-connector';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../../Helpers/localStorage';
import BASE_URL from '../../../Helpers/BASE_URL';

import Aux from '../../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Banner from '../../../components/UI/Banner/Banner';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Uploader from '../../../components/Uploader/Uploader';

class User extends Component {
  state = {};

  render() {
    return <Aux>User</Aux>;
  }
}

export default withErrorHandler(User, axios);

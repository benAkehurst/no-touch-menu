import React, { Component } from 'react';
import classes from './RegisterForm.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import BASE_URL from '../../Helpers/BASE_URL';

import Aux from '../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

class RegisterForm extends Component {
  state = {
    isLoading: false,
    isError: false,
    errorMessage: null,
    isSuccess: false,
    successMessage: null,
    isTokenValid: false,
    tokenValue: null,
    userName: null,
    userEmail: null,
    userPassword: null,
    restaurantName: null,
    restaurantTelephone: null,
  };

  onClickHandler = (key) => {
    switch (key) {
      case '':
        break;

      default:
        break;
    }
  };

  onChangeHandler = (key) => {
    switch (key) {
      case '':
        break;

      default:
        break;
    }
  };

  checkTokenValid = () => {};

  registerNewUser = () => {};

  render() {
    const checkToken = <div>Check Token</div>;
    const registerUser = <div>Register User</div>;

    return <Aux>{!this.state.isTokenValid ? checkToken : registerUser}</Aux>;
  }
}

export default withErrorHandler(RegisterForm, axios);

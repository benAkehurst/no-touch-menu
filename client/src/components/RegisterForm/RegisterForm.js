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
    userPassword: '',
    userTelephone: null,
    buttonIsDisabled: true,
  };

  resetTokenForm() {
    this.checkTokenForm.reset();
    this.setState({ tokenValue: '', userEmail: '' });
  }

  resetRegUserForm() {
    this.regUserForm.reset();
    this.setState({
      userName: '',
      userEmail: '',
      userPassword: '',
      userTelephone: '',
    });
  }

  checkTokenHandler = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const data = {
      email: this.state.userEmail,
      token: this.state.tokenValue,
    };
    axios
      .post(`${BASE_URL}api/auth/validate-access-token`, data)
      .then((response) => {
        if (response.data.success === true) {
          this.setState({
            isLoading: false,
            isSuccess: true,
            successMessage: `Your token is valid`,
            isTokenValid: true,
          });
        } else {
          this.setState({
            isLoading: false,
            isError: true,
            errorMessage: 'Something went wrong sending request.',
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          isError: true,
          errorMessage: 'Error - Something went wrong with your token.',
        });
      });
  };

  registerNewUserHandler = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const data = {
      name: this.state.userName,
      email: this.state.userEmail,
      password: this.state.userPassword,
      telephone: this.state.userTelephone,
    };
    axios
      .post(`${BASE_URL}api/auth/create-new-user`, data)
      .then((response) => {
        if (response.data.success === true) {
          this.setState({
            isLoading: false,
            isSuccess: true,
            successMessage: `User Created. Please Login!`,
          });
          this.resetRegUserForm();
        } else {
          this.setState({
            isLoading: false,
            isError: true,
            errorMessage: 'Something went wrong sending request.',
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          isError: true,
          errorMessage: 'Something went wrong creating your user.',
        });
      });
  };

  onChangeHandler = (event, key) => {
    let s = true;
    if (event.target.value.length) {
      s = false;
    }
    switch (key) {
      case 'token':
        this.setState({ tokenValue: event.target.value, buttonIsDisabled: s });
        break;
      case 'email':
        this.setState({ userEmail: event.target.value });
        break;
      case 'name':
        this.setState({ userName: event.target.value });
        break;
      case 'password':
        this.setState({
          userPassword: event.target.value,
          buttonIsDisabled: s,
        });
        break;
      case 'phone':
        this.setState({
          userTelephone: event.target.value,
        });
        break;
      default:
        break;
    }
  };

  clearError = () => {
    this.setState({
      isError: false,
      errorMessage: '',
      isSuccess: false,
      successMessage: '',
    });
    this.state.isTokenValid ? this.resetRegUserForm() : this.resetTokenForm();
  };

  render() {
    const errorMessage = (
      <h4 onClick={() => this.clearError()} className={classes.ErrorMessage}>
        {this.state.errorMessage}
      </h4>
    );
    const successMessage = (
      <h4 onClick={() => this.clearError()} className={classes.SuccessMessage}>
        {this.state.successMessage}
      </h4>
    );
    const checkToken = (
      <form
        ref={(el) => (this.checkTokenForm = el)}
        className={classes.Form}
        onSubmit={this.checkTokenHandler.bind(this)}
        method="POST"
      >
        <label>Token</label>
        <input
          key={'token'}
          type="text"
          placeholder="Token"
          className={[classes.Input, classes.InputElement].join(' ')}
          onChange={(event) => this.onChangeHandler(event, 'token')}
        />
        <label>Email</label>
        <input
          key={'email'}
          type="email"
          placeholder="Your Email"
          className={[classes.Input, classes.InputElement].join(' ')}
          onChange={(event) => this.onChangeHandler(event, 'email')}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.SubmitButton}
          disabled={this.state.buttonIsDisabled}
        >
          Validate Token
        </Button>
        {this.state.isTokenValid ? <Button>Show Register Form</Button> : null}
      </form>
    );
    const registerUser = (
      <form
        ref={(el) => (this.regUserForm = el)}
        className={classes.Form}
        onSubmit={this.registerNewUserHandler.bind(this)}
        method="POST"
      >
        <h4>Registration From</h4>
        <label>Name</label>
        <input
          key={'name'}
          type="text"
          placeholder="Name"
          className={[classes.Input, classes.InputElement].join(' ')}
          onChange={(event) => this.onChangeHandler(event, 'name')}
        />
        <label>Email</label>
        <input
          key={'email'}
          type="email"
          placeholder="Your Email"
          className={[classes.Input, classes.InputElement].join(' ')}
          onChange={(event) => this.onChangeHandler(event, 'email')}
        />
        <label>Password</label>
        <input
          key={'password'}
          type="password"
          placeholder="Password"
          className={[classes.Input, classes.InputElement].join(' ')}
          onChange={(event) => this.onChangeHandler(event, 'password')}
        />
        {this.state.userPassword.length < 6
          ? 'Password needs to be more than 6 characters'
          : null}
        <label>Telephone Number</label>
        <input
          key={'telephone'}
          type="text"
          placeholder="Telephone Number"
          className={[classes.Input, classes.InputElement].join(' ')}
          onChange={(event) => this.onChangeHandler(event, 'phone')}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.SubmitButton}
          disabled={this.state.buttonIsDisabled}
        >
          Register Now!
        </Button>
      </form>
    );

    return (
      <Aux>
        {this.state.isLoading ? (
          <div className={classes.LoadingBg}>
            <Spinner size={'large'} />
          </div>
        ) : null}
        {this.state.isError ? errorMessage : null}
        {this.state.isSuccess ? successMessage : null}
        {!this.state.isTokenValid ? checkToken : registerUser}
      </Aux>
    );
  }
}

export default withErrorHandler(RegisterForm, axios);

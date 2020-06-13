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
      restaurantName: '',
      restaurantTelephone: '',
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
        console.log('err: ', err);
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
      restaurantName: this.state.restaurantName,
      restaurantTelephone: this.state.restaurantTelephone,
    };
    // axios
    //   .post(`${BASE_URL}api/auth/validate-access-token`, data)
    //   .then((response) => {
    //     if (response.data.success === true) {
    //       this.setState({
    //         isLoading: false,
    //         isSuccess: true,
    //         successMessage: `Your token is valid`,
    //       });
    //       this.resetTokenForm();
    //     } else {
    //       this.setState({
    //         isLoading: false,
    //         isError: true,
    //         errorMessage: 'Something went wrong sending request.',
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     this.setState({
    //       isLoading: false,
    //       isError: true,
    //       errorMessage: 'Something went wrong with your token.',
    //     });
    //   });
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
        this.setState({ userEmail: event.target.value, buttonIsDisabled: s });
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
    {
      this.state.isTokenValid ? this.resetRegUserForm() : this.resetTokenForm();
    }
  };

  render() {
    const spinner = (
      <div className={classes.LoadingBg}>
        <Spinner size={'large'} />
      </div>
    );
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
          type="text"
          placeholder="Token"
          className={[classes.Input, classes.InputElement].join(' ')}
          onChange={(event) => this.onChangeHandler(event, 'token')}
        />
        <label>Email</label>
        <input
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
        onSubmit={this.checkTokenHandler.bind(this)}
        method="POST"
      >
        <h4>Registration From</h4>
        <label>Name</label>
        <input
          type="text"
          placeholder="Name"
          className={[classes.Input, classes.InputElement].join(' ')}
          onChange={(event) => this.onChangeHandler(event, 'name')}
        />
        <label>Email</label>
        <input
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
          Register Now!
        </Button>
      </form>
    );

    return (
      <Aux>
        {this.state.isLoading ? spinner : null}
        {this.state.isError ? errorMessage : null}
        {this.state.isSuccess ? successMessage : null}
        {!this.state.isTokenValid ? checkToken : registerUser}
      </Aux>
    );
  }
}

export default withErrorHandler(RegisterForm, axios);
